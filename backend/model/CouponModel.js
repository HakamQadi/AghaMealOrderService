import mongoose from "mongoose";

/**
 * Discount codes.
 *
 * `Order.couponCode` existed as a bare string with no collection behind it,
 * and `discountAmount` was whatever the client claimed — subtracted with no
 * ceiling, so a total could be driven negative. A discount now only exists if
 * a coupon says so, and the server computes the amount.
 */
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: { type: String, trim: true },

    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    // Percent (0-100) for "percentage", currency amount for "fixed".
    value: { type: Number, required: true, min: 0 },

    // Caps a percentage discount, e.g. "20% off, up to 5 JOD".
    maxDiscount: { type: Number, min: 0 },

    minOrderValue: { type: Number, default: 0, min: 0 },

    validFrom: { type: Date },
    validTo: { type: Date },

    // Total redemptions allowed across all customers. Null = unlimited.
    usageLimit: { type: Number, min: 0 },
    usageCount: { type: Number, default: 0, min: 0 },

    // Redemptions allowed per customer.
    perUserLimit: { type: Number, default: 1, min: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/** One row per redemption, so per-user limits can be enforced. */
const couponRedemptionSchema = new mongoose.Schema(
  {
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    discountAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

couponRedemptionSchema.index({ coupon: 1, user: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
const CouponRedemption = mongoose.model("CouponRedemption", couponRedemptionSchema);

export { Coupon, CouponRedemption };
