import express from "express";
import categoryController from "../controller/CategoryController.js";
import upload from "../utils/Multer.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public — the customer app's menu depends on this.
router.route("/").get(categoryController.getAllCategories);

// Staff only.
router
  .route("/add")
  .post(requireAdmin, upload.single("image"), categoryController.addCategory);
router
  .route("/update/:id")
  .patch(requireAdmin, upload.single("image"), categoryController.updateCategory);
router.route("/delete/:id").delete(requireAdmin, categoryController.deleteCategory);

export default router;
