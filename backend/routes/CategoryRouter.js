import express from "express";
const router = express.Router();
import categoryController from "../controller/CategoryController.js";

router.route("/").get(categoryController.getAllCategories);
router.route("/add").post(categoryController.addCategory);
router.route("/update/:id").patch(categoryController.updateCategory);
router.route("/delete/:id").delete(categoryController.deleteCategory);

export default router;
