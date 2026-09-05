import mongoose from "mongoose";
import { Review } from "../model/ReviewModel.js";
import { Order } from "../model/OrderModel.js";
import { Meal } from "../model/mealModel.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { badRequest, notFound, forbidden, conflict } from "../utils/HttpError.js";

/**
 * Recompute a meal's denormalised rating from its reviews. Cheaper than an
 * aggregation on every menu request, and the menu is read far more often
 * than reviews are written.
 */
const refreshMealRating = async (mealId) => {
  const [result] = await Review.aggregate([
    { $unwind: "$mealRatings" },
    { $match: { "mealRatings.meal": new mongoose.Types.ObjectId(String(mealId)) } },
    {
      $group: {
        _id: "$mealRatings.meal",
        average: { $avg: "$mealRatings.rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Meal.findByIdAndUpdate(mealId, {
    ratingAverage: Math.round((result?.average ?? 0) * 10) / 10,
    ratingCount: result?.count ?? 0,
  });
};

const createReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment, mealRatings } = req.body;

  const score = Number(rating);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw badRequest("rating must be a whole number from 1 to 5");
  }

  const order = await Order.findById(orderId);
  if (!order) throw notFound("Order not found");

  if (!order.user || String(order.user) !== String(req.user.id)) {
    throw forbidden("You can only review your own orders");
  }

  // Rating something that never arrived is meaningless.
  if (order.status !== "completed") {
    throw badRequest("You can only review an order once it is complete");
  }

  const existing = await Review.findOne({ order: order._id });
  if (existing) throw conflict("You have already reviewed this order");

  // Only meals that were actually in the order may be rated.
  const orderedMealIds = new Set(
    order.cartItems.filter((i) => i.meal).map((i) => String(i.meal))
  );
  const cleanMealRatings = (Array.isArray(mealRatings) ? mealRatings : [])
    .filter((m) => orderedMealIds.has(String(m.meal)))
    .filter((m) => Number.isInteger(Number(m.rating)) && m.rating >= 1 && m.rating <= 5)
    .map((m) => ({ meal: m.meal, rating: Number(m.rating) }));

  const review = await Review.create({
    order: order._id,
    user: req.user.id,
    rating: score,
    comment,
    mealRatings: cleanMealRatings,
  });

  await Promise.all(cleanMealRatings.map((m) => refreshMealRating(m.meal)));

  res.status(201).json({ message: "Thank you for your feedback", review });
});

/** A customer's own reviews. */
const myReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate({ path: "order", select: "createdAt totalPrice type" });
  res.status(200).json({ count: reviews.length, reviews });
});

/** Staff: every review, newest first. */
const listReviews = asyncHandler(async (req, res) => {
  const limit = Math.min(Number.parseInt(req.query.limit, 10) || 50, 200);
  const filter = req.query.rating ? { rating: Number(req.query.rating) } : {};

  const [reviews, total, [stats]] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "user", select: "name phone" })
      .populate({ path: "order", select: "createdAt totalPrice type" }),
    Review.countDocuments(filter),
    Review.aggregate([
      { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]),
  ]);

  res.status(200).json({
    total,
    count: reviews.length,
    averageRating: Math.round((stats?.average ?? 0) * 10) / 10,
    reviews,
  });
});

/** Staff reply to a review. */
const respondToReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  if (!response?.trim()) throw badRequest("response is required");

  const review = await Review.findByIdAndUpdate(
    id,
    { response: response.trim(), respondedAt: new Date() },
    { new: true }
  );
  if (!review) throw notFound("Review not found");

  res.status(200).json({ message: "Response saved", review });
});

export default { createReview, myReviews, listReviews, respondToReview };
