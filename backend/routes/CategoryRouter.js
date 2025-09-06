import express from "express";
const router = express.Router();
import categoryController from "../controller/CategoryController.js";
import upload from "../utils/Multer.js";

router.route("/").get(categoryController.getAllCategories);

router
  .route("/add")
  .post(upload.single("image"), categoryController.addCategory);

// TODO check if there is already a category in the new name before changing it
router
  .route("/update/:id")
  .patch(upload.single("image"), categoryController.updateCategory);

router.route("/delete/:id").delete(categoryController.deleteCategory);

export default router;
