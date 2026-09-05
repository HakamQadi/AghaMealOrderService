import { Coupon, CouponRedemption } from "../model/CouponModel.js";
import { validateCoupon } from "../services/coupons.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { badRequest, notFound } from "../utils/HttpError.js";

/** Customer-facing: "is this code any good on my basket?" */
const checkCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  const amount = Number(subtotal);
  if (!Number.isFinite(amount) || amount < 0) {
    throw badRequest("A valid subtotal is required");
  }

  const { coupon, discountAmount } = await validateCoupon(code, amount, req.user?.id);

  res.status(200).json({
    valid: true,
    code: coupon.code,
    description: coupon.description,
    discountAmount,
    newTotal: Math.round((amount - discountAmount) * 1000) / 1000,
  });
});

const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ count: coupons.length, coupons });
});

const createCoupon = asyncHandler(async (req, res) => {
  const { code, type, value } = req.body;

  if (!code) throw badRequest("code is required");
  if (!["percentage", "fixed"].includes(type)) {
    throw badRequest('type must be "percentage" or "fixed"');
  }
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw badRequest("value must be a positive number");
  }
  if (type === "percentage" && amount > 100) {
    throw badRequest("A percentage discount cannot exceed 100");
  }

  const existing = await Coupon.findOne({ code: String(code).toUpperCase().trim() });
  if (existing) throw badRequest("A coupon with that code already exists");

  const coupon = await Coupon.create({
    ...req.body,
    code: String(code).toUpperCase().trim(),
    value: amount,
  });

  res.status(201).json({ message: "Coupon created", coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // usageCount is a ledger, not a setting — it may only move via redemption.
  const { usageCount, code, ...updates } = req.body;

  if (updates.type && !["percentage", "fixed"].includes(updates.type)) {
    throw badRequest('type must be "percentage" or "fixed"');
  }

  const coupon = await Coupon.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw notFound("Coupon not found");

  res.status(200).json({ message: "Coupon updated", coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const redemptions = await CouponRedemption.countDocuments({ coupon: id });
  if (redemptions > 0) {
    // Deleting would orphan the redemption history that orders reference.
    const coupon = await Coupon.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!coupon) throw notFound("Coupon not found");
    return res.status(200).json({
      message: `Coupon has ${redemptions} redemption(s), so it was deactivated rather than deleted`,
      coupon,
    });
  }

  const deleted = await Coupon.findByIdAndDelete(id);
  if (!deleted) throw notFound("Coupon not found");

  res.status(200).json({ message: "Coupon deleted" });
});

export default { checkCoupon, listCoupons, createCoupon, updateCoupon, deleteCoupon };
