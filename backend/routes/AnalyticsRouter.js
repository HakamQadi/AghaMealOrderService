import express from "express";
import analyticsController from "../controller/AnalyticsController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Every figure here is commercially sensitive — staff only.
router.use(requireAdmin);

router.get("/overview", analyticsController.overview);
router.get("/summary", analyticsController.summary);
router.get("/menu", analyticsController.menu);
router.get("/demand", analyticsController.demand);
router.get("/customers", analyticsController.customers);
router.get("/export", analyticsController.exportOrders);

export default router;
