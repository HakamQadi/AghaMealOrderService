import express from "express";
import mealController from "../controller/MealsController.js";
import upload from "../utils/Multer.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public — the customer app's menu depends on these.
router.route("/").get(mealController.getAllMeals);
router.route("/category/:categoryId").get(mealController.getMealByCategory);

// Staff only.
router.route("/add").post(requireAdmin, upload.single("image"), mealController.addMeal);
router
  .route("/update/:id")
  .patch(requireAdmin, upload.single("image"), mealController.updateMeal);
router.route("/delete/:id").delete(requireAdmin, mealController.deleteMeal);

export default router;
