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

    // Addresses the customer has chosen to keep, so a returning customer
    // picks one instead of retyping it at every checkout.
    // Expo push tokens, one per device the customer has signed in on.
    pushTokens: [{ type: String }],

    savedAddresses: [
      {
        label: { type: String, trim: true },
        address: { type: String, required: true, trim: true },
        note: { type: String, trim: true },
        coordinates: { type: [Number], required: true }, // [lng, lat]
        createdAt: { type: Date, default: Date.now },
      },
    ],

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