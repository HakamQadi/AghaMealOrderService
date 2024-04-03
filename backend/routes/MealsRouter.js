import express from "express";
const router = express.Router();
import mealController from "../controller/MealsController.js";

router.route("/").get(mealController.getAllMeals);
router.route("/category/:category").get(mealController.getMealByCategory);
router.route("/add").post(mealController.addMeal);
router.route("/update/:id").patch(mealController.updateMeal);
router.route("/delete/:id").delete(mealController.deleteMeal);

export default router;
