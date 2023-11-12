// MealsController.js
import Meal from "../model/mealModel.js";

const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();

    res.status(200).json({
      message: "success",
      meals,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

const getMealByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const mealsByCategory = await Meal.find({ category });
    res.status(200).json({
      message: "success",
      mealsCount:mealsByCategory.length,
      mealsByCategory,
    });
  } catch (error) {}
};

export default {
  getAllMeals,
  getMealByCategory,
};
