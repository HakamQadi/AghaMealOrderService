import express from "express";
const router = express.Router();
import mealController from "../controller/MealsController.js";
import upload from "../utils/Multer.js";

router.route("/").get(mealController.getAllMeals);
router.route("/category/:categoryId").get(mealController.getMealByCategory);

router.route("/add").post(upload.single("image"), mealController.addMeal);

router
  .route("/update/:id")
  .patch(upload.single("image"), mealController.updateMeal);

router.route("/delete/:id").delete(mealController.deleteMeal);

export default router;
