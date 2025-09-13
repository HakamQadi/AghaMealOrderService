import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: { type: String, enum: ["admin", "user"], default: "user" },

    isActive: { type: Boolean, default: true },

    lastLogin: { type: Date },

    resetToken: { type: String },
    resetTokenExpiration: { type: Date },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };