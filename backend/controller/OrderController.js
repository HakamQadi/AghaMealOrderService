import { Order } from "../model/OrderModel.js";
import { User } from "../model/userModel.js";
import { priceCart, computeTotals } from "../services/priceCart.js";
import { getSettings } from "../model/SettingsModel.js";
import {
  validateDeliveryLocation,
  deliveryFeeFor,
  assertMinimumOrder,
} from "../services/delivery.js";
import { assertOpen } from "../services/businessHours.js";
import { notifyOrderStatus, notifyOrderPlaced } from "../services/notifications.js";
import { validateCoupon, redeemCoupon } from "../services/coupons.js";
import { awardPoints, redeemPoints } from "../services/loyalty.js";
import { validateScheduledFor, assertSlotCapacity } from "../services/scheduling.js";
import {
  assertTransition,
  nextStatuses,
  statusFromLegacy,
  CUSTOMER_CANCELLABLE,
  TERMINAL_STATUSES,
} from "../services/orderStatus.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { badRequest, notFound, forbidden } from "../utils/HttpError.js";

const ORDER_TYPES = ["pickup", "delivery"];

/**
 * The user an order is being placed for. Taken from the verified token when
 * one is present; falls back to the body only while ALLOW_LEGACY_UNAUTHED_ORDERS
 * is set, so published app builds that send no token keep working during a
 * rollout.
 */
const resolveOrderUserId = (req) => {
  if (req.user?.id) return req.user.id;
  if (process.env.ALLOW_LEGACY_UNAUTHED_ORDERS === "true") {
    return req.body.userId;
  }
  return undefined;
};

const assertValidType = (type) => {
  if (!ORDER_TYPES.includes(type)) {
    throw badRequest(`type must be one of: ${ORDER_TYPES.join(", ")}`);
  }
};

const createOrder = asyncHandler(async (req, res) => {
  const {
    name,
    contact,
    cartItems,
    location,
    type,
    saveAddress,
    couponCode,
    paymentMethod,
    loyaltyPoints,
    scheduledFor,
  } = req.body;

  if (!name || !contact) {
    throw badRequest("name and contact are required");
  }
  assertValidType(type);

  // Reject an obviously malformed request before spending a database round
  // trip on settings and the user lookup.
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw badRequest("cartItems is required and cannot be empty");
  }

  const settings = await getSettings();

  // A pre-order is checked against the time it is due, not against now — the
  // point of scheduling is ordering while the kitchen is shut.
  const scheduledSlot = validateScheduledFor(scheduledFor, settings);
  if (!scheduledSlot) assertOpen(settings);
  await assertSlotCapacity(scheduledSlot, settings, Order);

  const userId = resolveOrderUserId(req);
  if (!userId) throw badRequest("userId is required");

  const user = await User.findById(userId);
  if (!user) throw notFound("User not found");

  // Prices come from the Meal documents, never from the request body.
  const { items, subtotal, unavailable } = await priceCart(cartItems);

  assertMinimumOrder(subtotal, type, settings);

  // A delivery order without a usable address is rejected rather than stored
  // for staff to chase by phone.
  const deliveryLocation =
    type === "delivery" ? validateDeliveryLocation(location, settings) : undefined;

  // discountAmount is never read from the body. A discount exists only if a
  // coupon validates, and the server computes how much it is worth.
  let appliedCoupon = null;
  let discountAmount = 0;
  if (couponCode) {
    const result = await validateCoupon(couponCode, subtotal, user._id);
    appliedCoupon = result.coupon;
    discountAmount = result.discountAmount;
  }

  // Loyalty points are redeemed on top of any coupon, and both are computed
  // here — never taken from the request.
  let pointsSpent = 0;
  if (loyaltyPoints) {
    const remaining = Math.max(0, subtotal - discountAmount);
    const redemption = await redeemPoints(loyaltyPoints, remaining, user);
    pointsSpent = redemption.points;
    discountAmount += redemption.value;
  }

  const totals = computeTotals({
    subtotal,
    discountAmount,
    deliveryFee: deliveryFeeFor(type, settings),
  });

  const newOrder = await Order.create({
    name,
    contact,
    user: user._id,
    cartItems: items,
    ...totals,
    location: deliveryLocation,
    type,
    ...(appliedCoupon
      ? { coupon: appliedCoupon._id, couponCode: appliedCoupon.code }
      : {}),
    paymentMethod: ["cash", "card", "online"].includes(paymentMethod)
      ? paymentMethod
      : "cash",
    ...(pointsSpent ? { loyaltyRedeemed: pointsSpent } : {}),
    ...(scheduledSlot ? { scheduledFor: scheduledSlot } : {}),
    status: "placed",
    statusHistory: [{ status: "placed", at: new Date(), by: user._id }],
  });

  user.orders.push(newOrder._id);

  if (saveAddress && deliveryLocation) {
    const alreadySaved = user.savedAddresses?.some(
      (saved) => saved.address === deliveryLocation.address
    );
    if (!alreadySaved) {
      user.savedAddresses.push({
        label: typeof saveAddress === "string" ? saveAddress : undefined,
        address: deliveryLocation.address,
        note: deliveryLocation.note,
        coordinates: deliveryLocation.coordinates,
      });
    }
  }

  // Deduct BEFORE saving. This ran after user.save() at first, so the points
  // were discounted on the order but never taken off the balance — the same
  // points could be spent indefinitely.
  if (pointsSpent > 0) {
    user.loyaltyPoints = Math.max(0, (user.loyaltyPoints ?? 0) - pointsSpent);
  }

  await user.save();

  if (appliedCoupon) {
    await redeemCoupon({
      coupon: appliedCoupon,
      user: user._id,
      order: newOrder._id,
      discountAmount: totals.discountAmount,
    });
  }

  // Fire-and-forget: a notification failure must never fail the order.
  notifyOrderPlaced(newOrder, user).catch(() => {});

  res.status(201).json({
    message: "Order created successfully",
    orderId: newOrder._id,
    order: newOrder,
    // Tell the client when the server priced the cart differently from what it
    // displayed, so it can show "prices have changed" instead of silently
    // charging a different amount.
    ...(unavailable.length ? { unavailableItems: unavailable } : {}),
  });
});

const getAllOrdersAndById = asyncHandler(async (req, res) => {
  const { orderId } = req.query;

  if (orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw notFound("Order not found");
    return res.status(200).json({ message: "Order found", order });
  }

  const limit = Math.min(Number.parseInt(req.query.limit, 10) || 100, 500);
  const skip = Math.max(Number.parseInt(req.query.skip, 10) || 0, 0);

  // The order board asks for one status at a time, or for everything still
  // in play ("active"), so it does not have to pull the full history.
  const filter = {};
  if (req.query.status) {
    const requested = String(req.query.status).split(",").map((s) => s.trim());
    filter.status = { $in: requested };
  } else if (req.query.active === "true") {
    filter.status = { $nin: TERMINAL_STATUSES };
  }

  const [orders, total, counts] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
    // Per-status tallies for the board's column headers.
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.status(200).json({
    message: "Orders retrieved successfully",
    count: orders.length,
    total,
    statusCounts: Object.fromEntries(counts.map((c) => [c._id ?? "placed", c.count])),
    orders,
  });
});

const getOrdersByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate({
    path: "orders",
    options: { sort: { createdAt: -1 } },
  });

  if (!user) throw notFound("User not found");

  res.status(200).json({
    message: "Orders retrieved successfully",
    count: user.orders?.length ?? 0,
    orders: user.orders ?? [],
  });
});

/**
 * Staff status change. Accepts either the new `status` field or the legacy
 * `isDelivered` boolean, so an un-updated dashboard keeps working.
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, isDelivered, reason } = req.body;

  const target =
    status !== undefined
      ? status
      : typeof isDelivered === "boolean"
      ? statusFromLegacy(isDelivered)
      : undefined;

  if (target === undefined) {
    throw badRequest("status is required");
  }

  const order = await Order.findById(id);
  if (!order) throw notFound("Order not found");

  assertTransition(order.status, target);

  order.status = target;
  order.statusHistory.push({
    status: target,
    at: new Date(),
    by: req.user?.id,
    reason,
  });
  if (target === "cancelled" || target === "rejected") {
    order.cancellationReason = reason;
  }
  await order.save();

  const customer = order.user ? await User.findById(order.user) : null;

  // Points are earned only once the order actually completes.
  if (target === "completed") {
    await awardPoints(order, customer).catch((err) =>
      console.warn("Loyalty award failed:", err.message)
    );
  }

  notifyOrderStatus(order, customer).catch(() => {});

  res.status(200).json({
    message: `Order marked ${target}`,
    order,
    nextStatuses: nextStatuses(order.status),
  });
});

/**
 * Staff: record that an order was paid, or refunded.
 *
 * Cash on delivery is the norm, but without recording it there was no way to
 * reconcile a shift's takings.
 */
const updatePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, paymentMethod } = req.body;

  const VALID_STATUS = ["pending", "paid", "refunded"];
  const VALID_METHOD = ["cash", "card", "online"];

  if (paymentStatus !== undefined && !VALID_STATUS.includes(paymentStatus)) {
    throw badRequest(`paymentStatus must be one of: ${VALID_STATUS.join(", ")}`);
  }
  if (paymentMethod !== undefined && !VALID_METHOD.includes(paymentMethod)) {
    throw badRequest(`paymentMethod must be one of: ${VALID_METHOD.join(", ")}`);
  }
  if (paymentStatus === undefined && paymentMethod === undefined) {
    throw badRequest("paymentStatus or paymentMethod is required");
  }

  const order = await Order.findById(id);
  if (!order) throw notFound("Order not found");

  if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;
  if (paymentStatus !== undefined) {
    order.paymentStatus = paymentStatus;
    order.paidAt = paymentStatus === "paid" ? new Date() : undefined;
  }
  await order.save();

  res.status(200).json({ message: "Payment updated", order });
});

/** Customer-initiated cancellation, allowed only before the kitchen commits. */
const cancelOwnOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body ?? {};

  const order = await Order.findById(id);
  if (!order) throw notFound("Order not found");

  const isOwner = order.user && String(order.user) === String(req.user?.id);
  if (!isOwner && req.user?.role !== "admin") {
    throw forbidden("You can only cancel your own orders");
  }

  if (TERMINAL_STATUSES.includes(order.status)) {
    throw badRequest(`This order is already ${order.status}`);
  }
  if (!CUSTOMER_CANCELLABLE.includes(order.status) && req.user?.role !== "admin") {
    throw badRequest(
      "This order is already being prepared. Please call the restaurant to cancel."
    );
  }

  assertTransition(order.status, "cancelled");

  order.status = "cancelled";
  order.cancellationReason = reason || "Cancelled by customer";
  order.statusHistory.push({
    status: "cancelled",
    at: new Date(),
    by: req.user?.id,
    reason: order.cancellationReason,
  });
  await order.save();

  const owner = order.user ? await User.findById(order.user) : null;
  notifyOrderStatus(order, owner).catch(() => {});

  res.status(200).json({ message: "Order cancelled", order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) throw notFound("Order not found");

  // Keep User.orders consistent — previously the id was left dangling and
  // populate() silently dropped it.
  await User.updateMany({ orders: deleted._id }, { $pull: { orders: deleted._id } });

  res.status(200).json({ message: "Order deleted successfully" });
});

const reorder = asyncHandler(async (req, res) => {
  const { orderId, type, location } = req.body;

  if (!orderId) throw badRequest("orderId is required");

  const userId = resolveOrderUserId(req);
  if (!userId) throw badRequest("userId is required");

  const originalOrder = await Order.findById(orderId);
  if (!originalOrder) throw notFound("Original order not found");

  const user = await User.findById(userId);
  if (!user) throw notFound("User not found");

  // A customer may only reorder their own order. Orders placed before the
  // `user` field existed have no owner recorded, so fall back to the user's
  // own order list.
  const ownsOrder = originalOrder.user
    ? String(originalOrder.user) === String(user._id)
    : user.orders.some((id) => String(id) === String(originalOrder._id));

  if (!ownsOrder && req.user?.role !== "admin") {
    throw forbidden("You can only reorder your own orders");
  }

  const orderType = type ?? originalOrder.type;
  assertValidType(orderType);

  const settings = await getSettings();
  assertOpen(settings);

  // Re-price against the current menu rather than copying historic prices.
  // Lenient: a meal discontinued since the original order should not block
  // repeating the rest of it. The dropped items come back in the response.
  const { items, subtotal, unavailable } = await priceCart(
    originalOrder.cartItems.map((item) => ({
      mealId: item.meal ? String(item.meal) : undefined,
      name: item.name,
      quantity: item.quantity,
    })),
    { strict: false }
  );

  assertMinimumOrder(subtotal, orderType, settings);

  // Reuse the original address unless a new one was supplied, then hold it to
  // the same standard as a fresh order — an old order may predate address
  // capture, or the delivery area may have changed since.
  const previousLocation = originalOrder.location?.coordinates?.length
    ? originalOrder.location.toObject?.() ?? originalOrder.location
    : undefined;

  const resolvedLocation =
    orderType === "delivery"
      ? validateDeliveryLocation(location ?? previousLocation, settings)
      : undefined;

  const totals = computeTotals({
    subtotal,
    discountAmount: 0,
    deliveryFee: deliveryFeeFor(orderType, settings),
  });

  const newOrder = await Order.create({
    name: originalOrder.name,
    contact: originalOrder.contact,
    user: user._id,
    cartItems: items,
    ...totals,
    type: orderType,
    location: resolvedLocation,
    status: "placed",
    statusHistory: [{ status: "placed", at: new Date(), by: user._id }],
  });

  user.orders.push(newOrder._id);
  await user.save();

  res.status(201).json({
    message: "Reorder created successfully",
    newOrderId: newOrder._id,
    order: newOrder,
    ...(unavailable.length ? { unavailableItems: unavailable } : {}),
  });
});

export default {
  createOrder,
  getAllOrdersAndById,
  updateOrder,
  updatePayment,
  cancelOwnOrder,
  deleteOrder,
  getOrdersByUserId,
  reorder,
};
