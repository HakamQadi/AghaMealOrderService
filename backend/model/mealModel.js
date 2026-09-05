import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageFileIds: [
      {
        type: String,
        required: true,
      },
    ],

    // Kitchen ran out. Hides the meal from customers without deleting it —
    // deleting also destroyed the ImageKit images and broke reorder matching.
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Cleared automatically at the next opening, for "sold out for today".
    unavailableUntil: {
      type: Date,
    },

    // Surfaced on the app home screen.
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Optional promotional price. When set and lower than `price`, this is
    // what the customer pays — the server prices from it, not from the client.
    promoPrice: {
      type: Number,
      min: 0,
    },
    promoEndsAt: { type: Date },

    // Denormalised from Review, refreshed when a review lands. Kept on the
    // meal so the menu does not need an aggregation per request.
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    image: {
      type: String,
      required: true,
    },
    imageFileIds: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      en: { type: String, required: false },
      ar: { type: String, required: false },
    },

    // Hides a whole section from customers without deleting it.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);
const Category = mongoose.model("Category", categorySchema);

export { Meal, Category };
