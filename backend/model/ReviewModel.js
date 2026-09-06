import mongoose from "mongoose";

/**
 * Per-order feedback.
 *
 * There was no feedback loop of any kind: no way for a customer to say the
 * food was bad, and no signal to tell staff which menu items are working.
 * One review per order, so a rating always corresponds to a real purchase.
 */
const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },

    // Per-meal ratings, so the menu can be judged item by item rather than
    // only by the order as a whole.
    mealRatings: [
      {
        meal: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

    // Staff reply, shown back to the customer.
    response: { type: String, trim: true },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export { Review };
