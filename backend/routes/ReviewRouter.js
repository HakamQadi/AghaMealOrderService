import express from "express";
import reviewController from "../controller/ReviewController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, reviewController.createReview);
router.get("/mine", requireAuth, reviewController.myReviews);

router.get("/", requireAdmin, reviewController.listReviews);
router.post("/:id/respond", requireAdmin, reviewController.respondToReview);

export default router;
