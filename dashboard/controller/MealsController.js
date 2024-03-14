import { Category, Meal } from "../model/mealModel.js";
import mongoose from "mongoose";

// GET
const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();

    // * this will show the category object inside the meal object
    // const meals = await Meal.find().populate("category");

    // *this is how to access category info in the front
    // console.log(meals[0].category.name)
    // console.log(meals[0].category.image)

    res.status(200).json({
      message: "success",
      meals,
    });
  } catch (error) {
    res.status(404).json({
      message: "There is something wrong",
      error,
    });
  }
};

const getMealByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const mealsByCategory = await Meal.find({
      category: categoryDoc._id,
    });

    res.status(200).json({
      message: "success",
      mealsCount: mealsByCategory.length,
      mealsByCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
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

// POST
const addMeal = async (req, res) => {
  try {
    const { meal, category, price, image } = req.body;

    const isMealExist = await Meal.findOne({ meal });

    if (isMealExist) {
      return res.status(409).json({
        message: "Meal already existing",
        meal: isMealExist,
      });
    } else {
      const categoryDoc = await Category.findOne({ name: category });

      if (!categoryDoc) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      const newMeal = await Meal.create({
        meal,
        category: categoryDoc._id,
        price,
        image,
      });
      return res.status(201).json({
        message: "Add successfully",
        meal: newMeal,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: "There is something wrong",
      error,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const isCategoryExist = await Category.findOne({ name });

    if (isCategoryExist) {
      return res.status(409).json({
        message: "Category already existing",
        category: isCategoryExist,
      });
    } else {
      const newCategory = await Category.create({
        name,
        image,
      });
      return res.status(201).json({
        message: "Add successfully",
        category: newCategory,
      });
    }
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

  addMeal,
  addCategory,
};
