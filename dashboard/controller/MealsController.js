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
    // console.log(error);
    res.status(404).json({
      message: "There is something wrong",
      error,
    });
  }
};

const getMealByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const mealsByCategory = await Meal.find({ category });
    res.status(200).json({
      message: "success",
      mealsCount: mealsByCategory.length,
      mealsByCategory,
    });
  } catch (error) {
    res.status(404).json({
      message: "There is something wrong",
      error,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const meals = await Meal.find();
    const categoriesSet = new Set(meals.map((meal) => meal.category));
    const categories = Array.from(categoriesSet);
    res.status(200).json({
      message: "success",
      categories,
    });
  } catch (error) {
    res.status(404).json({
      message: "There is something wrong",
      error,
    });
  }
};

export default {
  getAllMeals,
  getMealByCategory,
  getAllCategories,
};
