import { Category, Meal } from "../model/mealModel.js";
import imagekit from "../utils/imagekit.js";

// GET
const getAllCategories = async (req, res) => {
  const { categoryName } = req.query;

  try {
    if (categoryName) {
      // Find category by English name
      const category = await Category.findOne({ "name.en": categoryName });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Get meals related to this category
      const meals = await Meal.find({ category: category._id });

      return res.status(200).json({
        message: "Category found successfully",
        category,
        meals,
      });
    } else {
      // Get all categories
      const categories = await Category.find();

      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "Categories not found" });
      }

      return res.status(200).json({
        message: "Categories found successfully",
        count: categories.length,
        categories,
      });
    }
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST
const addCategory = async (req, res) => {
  const name = {
    en: req.body["name.en"],
    ar: req.body["name.ar"],
  };

  const description = {
    en: req.body["description.en"] || "",
    ar: req.body["description.ar"] || "",
  };

  if (!name?.en || !name?.ar) {
    return res
      .status(400)
      .json({ message: "Both English and Arabic names are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    // Check if category already exists (by English or Arabic name)
    const categoryExist = await Category.findOne({
      $or: [{ "name.en": name.en }, { "name.ar": name.ar }],
    });

    if (categoryExist) {
      return res.status(409).json({ message: "Category already exists" });
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/agha-meal/categories",
    });

    const { url: imageUrl, fileId } = uploadedImage;

    // Create new category
    await Category.create({
      name,
      description,
      image: imageUrl,
      imageFileIds: fileId ? [fileId] : [],
    });
    return res.status(201).json({
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH
const updateCategory = async (req, res) => {
  const { id } = req.params;

  const name = {
    en: req.body["name.en"],
    ar: req.body["name.ar"],
  };

  const updateData = { name };

  // Only update description if provided
  if ("description.en" in req.body)
    updateData.description = updateData.description || {};
  if (req.body["description.en"])
    updateData.description.en = req.body["description.en"];
  if (req.body["description.ar"])
    updateData.description.ar = req.body["description.ar"];

  try {
    // Check if another category already has this name (ignore current one)
    const categoryExist = await Category.findOne({
      $or: [{ "name.en": name.en }, { "name.ar": name.ar }],
      _id: { $ne: id },
    });

    if (categoryExist) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    let imageUrl;

    // If new image uploaded → send to ImageKit
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/agha-meal/categories",
      });

      imageUrl = uploadedImage.url;

      // Push fileId into array
      await Category.findByIdAndUpdate(id, {
        $push: { imageFileIds: uploadedImage.fileId },
      });
    }

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Perform update
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If meals exist → block deletion
    const meals = await Meal.find({ category: id });
    if (meals.length > 0) {
      return res.status(409).json({
        message:
          "Failed to delete category because there are meals assigned to it",
      });
    }

    // Delete all images from ImageKit
    if (category.imageFileIds?.length) {
      for (const fileId of category.imageFileIds) {
        try {
          await imagekit.deleteFile(fileId);
        } catch (err) {
          console.warn(`Failed to delete file ${fileId} from ImageKit`, err);
        }
      }
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
