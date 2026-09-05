import express from "express";
import mealController from "../controller/MealsController.js";
import upload from "../utils/Multer.js";
import { requireAdmin, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public — the customer app's menu depends on these.
// optionalAuth so an admin sees unavailable meals too, without making the
// menu itself require a login.
router.route("/").get(optionalAuth, mealController.getAllMeals);
router.route("/featured").get(optionalAuth, mealController.getFeaturedMeals);
router
  .route("/category/:categoryId")
  .get(optionalAuth, mealController.getMealByCategory);

// Staff only.
router.route("/add").post(requireAdmin, upload.single("image"), mealController.addMeal);
router
  .route("/update/:id")
  .patch(requireAdmin, upload.single("image"), mealController.updateMeal);
router.route("/promotion/:id").patch(requireAdmin, mealController.setPromotion);
router
  .route("/availability/:id")
  .patch(requireAdmin, mealController.setAvailability);
router.route("/delete/:id").delete(requireAdmin, mealController.deleteMeal);

export default router;
