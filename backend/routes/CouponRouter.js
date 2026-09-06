import express from "express";
import couponController from "../controller/CouponController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Customers check a code against their own basket before checkout.
router.post("/validate", requireAuth, couponController.checkCoupon);

// Staff CRUD.
router.get("/", requireAdmin, couponController.listCoupons);
router.post("/", requireAdmin, couponController.createCoupon);
router.patch("/:id", requireAdmin, couponController.updateCoupon);
router.delete("/:id", requireAdmin, couponController.deleteCoupon);

export default router;
