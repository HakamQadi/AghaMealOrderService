import { Coupon, CouponRedemption } from "../model/CouponModel.js";
import { badRequest, notFound } from "../utils/HttpError.js";

/** Round money to fils so floating point never reaches the database. */
const round = (n) => Math.round(n * 1000) / 1000;

/**
 * Compute the discount a coupon gives on a subtotal. Pure, so it is testable
 * without a database and cannot be influenced by the request body.
 */
export const computeDiscount = (coupon, subtotal) => {
  const raw =
    coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value;

  const capped =
    coupon.type === "percentage" && coupon.maxDiscount != null
      ? Math.min(raw, coupon.maxDiscount)
      : raw;

  // Never more than the basket is worth — that is how a total went negative.
  return round(Math.max(0, Math.min(capped, subtotal)));
};

/**
 * Validate a coupon for this customer and basket.
 *
 * @returns {Promise<{coupon: object, discountAmount: number}>}
 */
export const validateCoupon = async (code, subtotal, userId) => {
  if (!code) throw badRequest("A coupon code is required");

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim() });
  if (!coupon) throw notFound("That coupon code is not valid");

  if (!coupon.isActive) throw badRequest("That coupon is no longer active");

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) {
    throw badRequest("That coupon is not valid yet");
  }
  if (coupon.validTo && now > coupon.validTo) {
    throw badRequest("That coupon has expired");
  }

  if (coupon.minOrderValue > 0 && subtotal < coupon.minOrderValue) {
    throw badRequest(
      `This coupon needs a minimum order of ${coupon.minOrderValue}. Your basket is ${subtotal}.`
    );
  }

  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    throw badRequest("That coupon has been fully redeemed");
  }

  if (userId && coupon.perUserLimit > 0) {
    const used = await CouponRedemption.countDocuments({
      coupon: coupon._id,
      user: userId,
    });
    if (used >= coupon.perUserLimit) {
      throw badRequest("You have already used this coupon");
    }
  }

  const discountAmount = computeDiscount(coupon, subtotal);
  if (discountAmount <= 0) {
    throw badRequest("That coupon gives no discount on this order");
  }

  return { coupon, discountAmount };
};

/**
 * Record a redemption once the order exists.
 *
 * $inc is conditional on the limit not yet being reached, so two concurrent
 * checkouts cannot push usageCount past usageLimit.
 */
export const redeemCoupon = async ({ coupon, user, order, discountAmount }) => {
  const guard =
    coupon.usageLimit != null
      ? { _id: coupon._id, usageCount: { $lt: coupon.usageLimit } }
      : { _id: coupon._id };

  const result = await Coupon.updateOne(guard, { $inc: { usageCount: 1 } });

  if (result.modifiedCount === 0) {
    // Someone took the last redemption between validation and here.
    return { redeemed: false };
  }

  await CouponRedemption.create({
    coupon: coupon._id,
    user,
    order,
    discountAmount,
  });

  return { redeemed: true };
};
