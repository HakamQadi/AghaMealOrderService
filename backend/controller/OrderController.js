import { Order } from "../model/OrderModel.js";
import { User } from "../model/userModel.js";
import { priceCart, computeTotals } from "../services/priceCart.js";
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
  const { name, contact, cartItems, location, type } = req.body;

  if (!name || !contact) {
    throw badRequest("name and contact are required");
  }
  assertValidType(type);

  const userId = resolveOrderUserId(req);
  if (!userId) throw badRequest("userId is required");

  const user = await User.findById(userId);
  if (!user) throw notFound("User not found");

  // Prices come from the Meal documents, never from the request body.
  const { items, subtotal, unavailable } = await priceCart(cartItems);

  // discountAmount is intentionally NOT read from the body. Until the coupon
  // engine exists (Phase 3.2) there is no trusted source for a discount, so it
  // is always zero rather than whatever the caller claims.
  const totals = computeTotals({ subtotal, discountAmount: 0, deliveryFee: 0 });

  const hasCoordinates = Array.isArray(location?.coordinates)
    ? location.coordinates.length === 2
    : false;

  const newOrder = await Order.create({
    name,
    contact,
    user: user._id,
    cartItems: items,
    ...totals,
    location: hasCoordinates ? location : undefined,
    type,
  });

  user.orders.push(newOrder._id);
  await user.save();

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

  const [orders, total] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.estimatedDocumentCount(),
  ]);

  res.status(200).json({
    message: "Orders retrieved successfully",
    count: orders.length,
    total,
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

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isDelivered } = req.body;

  if (typeof isDelivered !== "boolean") {
    throw badRequest("isDelivered must be a boolean");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { isDelivered },
    { new: true }
  );

  if (!updatedOrder) throw notFound("Order not found");

  res.status(200).json({
    message: "Order updated successfully",
    order: updatedOrder,
  });
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

  // Re-price against the current menu rather than copying historic prices.
  const { items, subtotal, unavailable } = await priceCart(
    originalOrder.cartItems.map((item) => ({
      mealId: item.meal ? String(item.meal) : undefined,
      name: item.name,
      quantity: item.quantity,
    }))
  );

  const totals = computeTotals({ subtotal, discountAmount: 0, deliveryFee: 0 });

  const resolvedLocation =
    location ??
    (originalOrder.location?.coordinates?.length
      ? originalOrder.location.toObject?.() ?? originalOrder.location
      : undefined);

  const newOrder = await Order.create({
    name: originalOrder.name,
    contact: originalOrder.contact,
    user: user._id,
    cartItems: items,
    ...totals,
    type: orderType,
    location: resolvedLocation,
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
  deleteOrder,
  getOrdersByUserId,
  reorder,
};
