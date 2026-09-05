import mongoose from "mongoose";
import { ORDER_STATUSES } from "../services/orderStatus.js";

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

    // Owner of the order. Previously the link existed only as User.orders[],
    // which made "who does this order belong to?" unanswerable from the order.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    cartItems: [
      {
        // Reference to the source meal. Written for every new order; absent on
        // orders placed before server-authoritative pricing.
        meal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Meal",
        },
        name: {
          en: { type: String, required: true },
          ar: { type: String, required: true },
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    // Money is stored broken down so a receipt reconciles:
    //   totalPrice = subtotal - discountAmount + deliveryFee
    subtotal: {
      type: Number,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "placed",
      index: true,
    },

    // Append-only audit of every status change: what, when, and who.
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUSES, required: true },
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String },
      },
    ],

    cancellationReason: { type: String },
    type: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },

    couponCode: { type: String },
    discountAmount: { type: Number, default: 0, min: 0 },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      address: {
        type: String,
      },
      // Free-text delivery instruction, e.g. "call on arrival".
      note: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

/**
 * `isDelivered` was the entire fulfilment model before the status enum
 * existed. Kept as a virtual for one release so already-published app builds
 * and any un-migrated dashboard code keep reading something sensible.
 * Remove once every client reads `status`.
 */
orderSchema.virtual("isDelivered").get(function () {
  return this.status === "completed";
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);
export { Order };
