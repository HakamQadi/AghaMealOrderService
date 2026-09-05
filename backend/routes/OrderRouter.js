import express from "express";
import OrderController from "../controller/OrderController.js";
import {
  requireAdmin,
  requireAuth,
  requireSelfOrAdmin,
  optionalAuth,
} from "../middleware/auth.js";

const orderRoutes = express.Router();

/**
 * Order creation accepts a token when the client sends one. Published app
 * builds do not yet, so during the rollout window
 * ALLOW_LEGACY_UNAUTHED_ORDERS=true lets them through on optionalAuth; with
 * the flag unset (the default) the request is rejected outright.
 *
 * The flag is read per request rather than once at import time: ES module
 * imports are hoisted, so this module is evaluated before server.js gets to
 * call dotenv.config() — reading it here at module scope would always see
 * undefined regardless of what .env says.
 */
const orderAuth = (req, res, next) =>
  process.env.ALLOW_LEGACY_UNAUTHED_ORDERS === "true"
    ? optionalAuth(req, res, next)
    : requireAuth(req, res, next);

// Staff: the full order list.
orderRoutes.get("/", requireAdmin, OrderController.getAllOrdersAndById);

// A customer's own history — or any history, for staff.
orderRoutes.get(
  "/user/:userId",
  requireSelfOrAdmin("userId"),
  OrderController.getOrdersByUserId
);

orderRoutes.post("/add", orderAuth, OrderController.createOrder);
orderRoutes.post("/reorder", orderAuth, OrderController.reorder);

// A customer may pull out before the kitchen commits; staff may always cancel.
orderRoutes.post("/:id/cancel", requireAuth, OrderController.cancelOwnOrder);

// Staff only.
orderRoutes.patch("/update/:id", requireAdmin, OrderController.updateOrder);
orderRoutes.patch("/:id/status", requireAdmin, OrderController.updateOrder);
orderRoutes.patch("/:id/payment", requireAdmin, OrderController.updatePayment);
orderRoutes.delete("/delete/:id", requireAdmin, OrderController.deleteOrder);

export default orderRoutes;
