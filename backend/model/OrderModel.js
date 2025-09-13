import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    contact: {
      type: String, // email or phone
      required: true,
    },

    cartItems: [
      {
        name: {
          en: { type: String, required: true },
          ar: { type: String, required: true },
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },

    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Order = mongoose.model("Order", orderSchema);
export { Order };
