import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { Meal } from "../model/mealModel.js";
import { priceCart, computeTotals, MAX_QUANTITY_PER_ITEM } from "../services/priceCart.js";

const id = (hex) => new mongoose.Types.ObjectId(hex);
const BURGER = id("aaaaaaaaaaaaaaaaaaaaaaaa");
const WRAP = id("bbbbbbbbbbbbbbbbbbbbbbbb");

const MENU = [
  { _id: BURGER, name: { en: "Burger", ar: "برجر" }, price: 5 },
  { _id: WRAP, name: { en: "Wrap", ar: "راب" }, price: 2.5 },
];

/** Stub Meal.find so the pricing logic can be tested without a database. */
const withMenu = (menu = MENU) => {
  const original = Meal.find;
  Meal.find = async (query = {}) => {
    if (query._id?.$in) {
      const wanted = query._id.$in.map(String);
      return menu.filter((m) => wanted.includes(String(m._id)));
    }
    if (query.$or) {
      return menu.filter((m) =>
        query.$or.some(
          (clause) =>
            clause["name.en"] === m.name.en || clause["name.ar"] === m.name.ar
        )
      );
    }
    return menu;
  };
  return () => {
    Meal.find = original;
  };
};

test("ignores a client-supplied price and uses the menu price", async (t) => {
  t.after(withMenu());

  const { items, subtotal } = await priceCart([
    { mealId: String(BURGER), quantity: 2, price: 0.01 },
  ]);

  assert.equal(items[0].price, 5, "must price from the Meal document");
  assert.equal(subtotal, 10);
});

test("a zero-price cart cannot be forced", async (t) => {
  t.after(withMenu());

  const { subtotal } = await priceCart([
    { mealId: String(BURGER), quantity: 1, price: 0 },
    { mealId: String(WRAP), quantity: 1, price: 0 },
  ]);

  assert.equal(subtotal, 7.5);
});

test("resolves legacy carts that send only a name", async (t) => {
  t.after(withMenu());

  const { items, subtotal } = await priceCart([
    { name: { en: "Burger", ar: "برجر" }, quantity: 1, price: 999 },
  ]);

  assert.equal(items[0].price, 5);
  assert.equal(String(items[0].meal), String(BURGER));
  assert.equal(subtotal, 5);
});

test("clamps quantity to a sane range", async (t) => {
  t.after(withMenu());

  const huge = await priceCart([{ mealId: String(BURGER), quantity: 10_000 }]);
  assert.equal(huge.items[0].quantity, MAX_QUANTITY_PER_ITEM);

  const negative = await priceCart([{ mealId: String(BURGER), quantity: -3 }]);
  assert.equal(negative.items[0].quantity, 1);

  const nonsense = await priceCart([{ mealId: String(BURGER), quantity: "abc" }]);
  assert.equal(nonsense.items[0].quantity, 1);
});

test("reports items that no longer exist instead of pricing them", async (t) => {
  t.after(withMenu());

  const { items, subtotal, unavailable } = await priceCart([
    { mealId: String(BURGER), quantity: 1 },
    { mealId: String(id("cccccccccccccccccccccccc")), quantity: 1 },
  ]);

  assert.equal(items.length, 1);
  assert.equal(subtotal, 5);
  assert.equal(unavailable.length, 1);
});

test("rejects an empty cart", async () => {
  await assert.rejects(() => priceCart([]), /cannot be empty/);
  await assert.rejects(() => priceCart(undefined), /required/);
});

test("rejects a cart where nothing resolves", async (t) => {
  t.after(withMenu());

  await assert.rejects(
    () => priceCart([{ mealId: String(id("dddddddddddddddddddddddd")) }]),
    /not available any more|available any more/
  );
});

test("issues one query per lookup strategy, not one per line item", async (t) => {
  const restore = withMenu();
  t.after(restore);

  let calls = 0;
  const stubbed = Meal.find;
  Meal.find = async (q) => {
    calls += 1;
    return stubbed(q);
  };

  await priceCart([
    { mealId: String(BURGER), quantity: 1 },
    { mealId: String(WRAP), quantity: 1 },
    { name: { en: "Burger", ar: "برجر" }, quantity: 1 },
  ]);

  assert.equal(calls, 2, "one query for ids, one for legacy names");
});

test("discount can never exceed the subtotal or drive the total negative", () => {
  const totals = computeTotals({ subtotal: 10, discountAmount: 999 });
  assert.equal(totals.discountAmount, 10);
  assert.equal(totals.totalPrice, 0);

  const negative = computeTotals({ subtotal: 10, discountAmount: -5 });
  assert.equal(negative.discountAmount, 0);
  assert.equal(negative.totalPrice, 10);
});

test("total reconciles as subtotal - discount + fee", () => {
  const t = computeTotals({ subtotal: 20, discountAmount: 5, deliveryFee: 1.5 });
  assert.equal(t.totalPrice, 16.5);
  assert.equal(t.subtotal - t.discountAmount + t.deliveryFee, t.totalPrice);
});
