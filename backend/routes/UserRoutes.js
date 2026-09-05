import express from "express";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  registerPushToken,
  getMe,
  toggleFavourite,
  listUsers,
  setUserActive,
} from "../controller/UserController.js";
import { rateLimit, phoneKey } from "../middleware/rateLimit.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

// Credential endpoints are the ones worth brute forcing, so they are the ones
// that are limited.
const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10, keyFn: phoneKey });
const resetLimiter = rateLimit({ windowMs: 15 * 60_000, max: 5, keyFn: phoneKey });

userRouter.post("/register", authLimiter, register);
userRouter.post("/login", authLimiter, login);
userRouter.post("/request-reset", resetLimiter, requestPasswordReset);
userRouter.post("/reset-password", resetLimiter, resetPassword);

// Signed-in customer.
userRouter.post("/push-token", requireAuth, registerPushToken);
userRouter.get("/me", requireAuth, getMe);
userRouter.post("/me/favourites/:mealId", requireAuth, toggleFavourite);

// Staff: customer management.
userRouter.get("/admin/users", requireAdmin, listUsers);
userRouter.patch("/admin/users/:id/active", requireAdmin, setUserActive);

export default userRouter;
