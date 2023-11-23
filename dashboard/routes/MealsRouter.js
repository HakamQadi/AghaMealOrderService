// MealsRouter.js
import express from "express";
const router = express.Router();
import mealController from "../controller/MealsController.js";

router.route("/").get(mealController.getAllMeals);
router.route("/category").get(mealController.getAllCategories);
router.route("/:category").get(mealController.getMealByCategory);

export default router;
