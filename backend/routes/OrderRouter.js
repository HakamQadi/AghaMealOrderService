import express from "express";
import OrderController from "../controller/OrderController.js";
const orderRoutes = express.Router();

orderRoutes.get("/", OrderController.getAllOrdersAndById);
orderRoutes.get("/user/:userId", OrderController.getOrdersByUserId);

orderRoutes.post("/add", OrderController.createOrder);

orderRoutes.patch("/update/:id", OrderController.updateOrder);

orderRoutes.delete("/delete/:id", OrderController.deleteOrder);

export default orderRoutes;
