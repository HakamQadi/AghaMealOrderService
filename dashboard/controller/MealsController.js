import { Category, Meal } from "../model/mealModel.js";

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

// PATCH
const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { meal, category, price, image } = req.body;

    const isMealExist = await Meal.findOne({ _id: id });
    if (!isMealExist) {
      return res.status(404).json({
        message: "Meal not found",
      });
    } else {
      const updateFields = {};

      if (meal) updateFields.meal = meal;
      if (price) updateFields.price = price;
      if (image) updateFields.image = image;

      if (category) {
        const categoryDoc = await Category.findOne({ name: category });

        if (!categoryDoc) {
          return res.status(404).json({
            message: "Category not found",
          });
        } else {
          updateFields.category = categoryDoc._id;
        }
      }
      const updatedMeal = await Meal.findOneAndUpdate(
        { _id: id },
        updateFields,
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: "Meal updated successfully",
        meal: updatedMeal,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: "There is something wrong",
      error,
    });
  }
};

// DELETE
const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMeal = await Meal.findByIdAndDelete({ _id: id });
    if (!deletedMeal) {
      return res.status(404).json({
        message: "Meal not found ",
      });
    } else {
      return res.status(200).json({
        message: "Meal deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "There is something wrong",
      error,
    });
  }
};

export default {
  getAllMeals,
  getMealByCategory,
  addMeal,
  updateMeal,
  deleteMeal,
};
