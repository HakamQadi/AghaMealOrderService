import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register
const register = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Phone number already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);

    // TODO for now isActive is alwayes true, but that will change when implement an OTP logic
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: role || "user",
      lastLogin: new Date(),
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password is wrong" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 60 * 1000; // 1 Minute

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiry;

    await user.save();

    res.status(200).json({ message: "Reset link generated", resetToken });
  } catch (error) {
    console.error("Error requestPasswordReset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Error resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login, requestPasswordReset, resetPassword };
