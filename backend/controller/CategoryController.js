import { Category, Meal } from "../model/mealModel.js";

// GET
const getAllCategories = async (req, res) => {
  console.log("::::::TEST:::::");
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "success",
      length: categories.length,
      categories,
    });
  } catch (error) {
    res.status(404).json({
      message: "There is something wrong",
      error: error.message,
    });
  }
};

// POST
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

// PATCH
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const existingCategory = await Category.findOneAndUpdate(
      { _id: id },
      { name, image },
      { new: true }
    );

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: existingCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "There is something wrong",
      error,
    });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const selectedCategory = await Category.findById(id);
    if (!selectedCategory) {
      return res.status(404).json({
        message: "Category not found ",
      });
    } else {
      const meals = await Meal.find({
        category: id,
      });
      if (meals.length > 0) {
        return res.status(409).json({
          message:
            "Failed to delete Category beacuse there is meals in this Category",
        });
      } else {
        await Category.deleteOne({ _id: id });
        return res.status(200).json({
          message: "Category deleted successfully",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "There is something wrong",
      error,
    });
  }
};

export default {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
