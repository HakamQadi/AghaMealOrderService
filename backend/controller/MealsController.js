import { Category, Meal } from "../model/mealModel.js";
import imagekit from "../utils/Imagekit.js";

// GET
const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find().populate("category");

    if (!meals || meals.length === 0) {
      return res.status(404).json({ message: "Meals not found" });
    }

    res.status(200).json({
      message: "Meals found successfully",
      count: meals.length,
      meals,
    });
  } catch (error) {
    console.error("Error getting meals:", error); 
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMealByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const meals = await Meal.find({ category: categoryDoc._id });

    res.status(200).json({
      message: "Meals found successfully",
      count: meals.length,
      meals,
    });
  } catch (error) {
    console.error("Error getting meals by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST
const addMeal = async (req, res) => {
  const name = {
    en: req.body["name.en"],
    ar: req.body["name.ar"],
  };

  const { categoryId, price } = req.body;

  if (!name?.en || !name?.ar) {
    return res
      .status(400)
      .json({ message: "Both English and Arabic names are required" });
  }

  if (!price || isNaN(price)) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    // Check if meal already exists
    const mealExist = await Meal.findOne({
      $or: [{ "name.en": name.en }, { "name.ar": name.ar }],
    });

    if (mealExist) {
      return res.status(409).json({ message: "Meal already exists" });
    }

    // Validate category
    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/agha-meal/meals",
    });

    const { url: imageUrl, fileId } = uploadedImage;

    // Create meal
    await Meal.create({
      name,
      category: categoryDoc._id,
      price,
      image: imageUrl,
      imageFileIds: fileId ? [fileId] : [],
    });

    return res.status(201).json({ message: "Meal created successfully" });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH
const updateMeal = async (req, res) => {
  const { id } = req.params;

  const name = {
    en: req.body["name.en"],
    ar: req.body["name.ar"],
  };

  const updateData = {};
  if (name.en || name.ar) updateData.name = name;
  if (req.body.price) updateData.price = req.body.price;

  if (req.body.categoryId) {
    const categoryDoc = await Category.findById(req.body.categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }
    updateData.category = categoryDoc._id;
  }
  try {
    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Check duplicate meal name (ignore current one)
    if (name.en || name.ar) {
      const mealExist = await Meal.findOne({
        $or: [{ "name.en": name.en }, { "name.ar": name.ar }],
        _id: { $ne: id },
      });

      if (mealExist) {
        return res
          .status(400)
          .json({ message: "Meal with this name already exists" });
      }
    }

    let imageUrl;

    // If new image uploaded
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/agha-meal/meals",
      });

      imageUrl = uploadedImage.url;

      // Push fileId
      await Meal.findByIdAndUpdate(id, {
        $push: { imageFileIds: uploadedImage.fileId },
      });
    }

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedMeal = await Meal.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({
      message: "Meal updated successfully",
      meal: updatedMeal,
    });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE
const deleteMeal = async (req, res) => {
  const { id } = req.params;

  try {
    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Delete images from ImageKit
    if (meal.imageFileIds?.length) {
      for (const fileId of meal.imageFileIds) {
        try {
          await imagekit.deleteFile(fileId);
        } catch (err) {
          console.warn(`Failed to delete file ${fileId} from ImageKit`, err);
        }
      }
    }

    await Meal.findByIdAndDelete(id);

    return res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllMeals,
  getMealByCategory,
  addMeal,
  updateMeal,
  deleteMeal,
};
