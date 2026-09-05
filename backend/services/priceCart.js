import mongoose from "mongoose";
import { Meal } from "../model/mealModel.js";
import { badRequest, notFound } from "../utils/HttpError.js";

export const MAX_QUANTITY_PER_ITEM = 50;

const isObjectId = (value) =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const normaliseQuantity = (raw) => {
  const qty = Number.parseInt(raw ?? 1, 10);
  if (!Number.isFinite(qty) || qty < 1) return 1;
  return Math.min(qty, MAX_QUANTITY_PER_ITEM);
};

/**
 * Resolve a client cart into server-priced line items.
 *
 * The client sends only *what* it wants, never *what it costs*. Any `price`
 * in the request is ignored — that was the hole that let a caller order any
 * meal for any amount.
 *
 * Two identifier shapes are accepted so that already-published app builds keep
 * working through a rollout:
 *   - { mealId, quantity }                 <- current clients
 *   - { name: { en, ar }, quantity }       <- legacy clients, resolved by name
 *
 * @returns {Promise<{items: Array, subtotal: number, unavailable: Array}>}
 */
export const priceCart = async (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw badRequest("cartItems is required and cannot be empty");
  }

  const ids = cartItems.map((i) => i.mealId).filter(isObjectId);

  const nameClauses = cartItems
    .filter((i) => !isObjectId(i.mealId) && i.name)
    .flatMap((i) =>
      [
        i.name.en ? { "name.en": i.name.en } : null,
        i.name.ar ? { "name.ar": i.name.ar } : null,
      ].filter(Boolean)
    );

  // One query for ids, one for legacy name lookups — not one per line item.
  const [byIdDocs, byNameDocs] = await Promise.all([
    ids.length ? Meal.find({ _id: { $in: ids } }) : [],
    nameClauses.length ? Meal.find({ $or: nameClauses }) : [],
  ]);

  const byId = new Map(byIdDocs.map((m) => [String(m._id), m]));
  const byName = new Map();
  for (const meal of byNameDocs) {
    if (meal.name?.en) byName.set(`en:${meal.name.en}`, meal);
    if (meal.name?.ar) byName.set(`ar:${meal.name.ar}`, meal);
  }

  const resolve = (item) => {
    if (isObjectId(item.mealId)) return byId.get(item.mealId);
    if (item.name?.en && byName.has(`en:${item.name.en}`)) {
      return byName.get(`en:${item.name.en}`);
    }
    if (item.name?.ar && byName.has(`ar:${item.name.ar}`)) {
      return byName.get(`ar:${item.name.ar}`);
    }
    return undefined;
  };

  const items = [];
  const unavailable = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const meal = resolve(item);

    if (!meal) {
      unavailable.push(item.name?.en || item.mealId || "unknown item");
      continue;
    }

    const quantity = normaliseQuantity(item.quantity);
    // Price and name are read from the Meal document, never from the request.
    subtotal += meal.price * quantity;

    items.push({
      meal: meal._id,
      name: meal.name,
      price: meal.price,
      quantity,
    });
  }

  if (items.length === 0) {
    throw notFound(
      `None of the items in the cart are available any more: ${unavailable.join(", ")}`
    );
  }

  // Round to fils (3dp) to keep floating point out of stored money values.
  subtotal = Math.round(subtotal * 1000) / 1000;

  return { items, subtotal, unavailable };
};

/**
 * Compute the order total. Discount is clamped so it can never exceed the
 * subtotal, and the total can never go negative.
 */
export const computeTotals = ({ subtotal, discountAmount = 0, deliveryFee = 0 }) => {
  const discount = Math.min(Math.max(Number(discountAmount) || 0, 0), subtotal);
  const fee = Math.max(Number(deliveryFee) || 0, 0);
  const total = Math.round((subtotal - discount + fee) * 1000) / 1000;
  return { subtotal, discountAmount: discount, deliveryFee: fee, totalPrice: total };
};
