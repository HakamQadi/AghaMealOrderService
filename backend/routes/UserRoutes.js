import express from "express";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from "../controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/request-reset", requestPasswordReset);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
