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
orderSchema.index({ isDelivered: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export { Order };
