import express from "express";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from "../controller/UserController.js";
import { rateLimit, phoneKey } from "../middleware/rateLimit.js";

const userRouter = express.Router();

// Credential endpoints are the ones worth brute forcing, so they are the ones
// that are limited.
const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10, keyFn: phoneKey });
const resetLimiter = rateLimit({ windowMs: 15 * 60_000, max: 5, keyFn: phoneKey });

userRouter.post("/register", authLimiter, register);
userRouter.post("/login", authLimiter, login);
userRouter.post("/request-reset", resetLimiter, requestPasswordReset);
userRouter.post("/reset-password", resetLimiter, resetPassword);

export default userRouter;
