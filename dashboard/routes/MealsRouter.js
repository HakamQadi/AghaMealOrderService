// MealsRouter.js
import express from "express";
const router = express.Router();
import mealController from "../controller/MealsController.js";

router.route("/meals").get(mealController.getAllMeals);
router.route("/category").get(mealController.getAllCategories);
router.route("/category/:category").get(mealController.getMealByCategory);

router.route("/meals/add").post(mealController.addMeal);
router.route("/category/add").post(mealController.addCategory);

export default router;
