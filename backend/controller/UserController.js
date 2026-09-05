import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { badRequest, conflict, unauthorized } from "../utils/HttpError.js";

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MIN_PASSWORD_LENGTH = 8;

// A real bcrypt hash of a throwaway string, compared against when no user is
// found so that login takes the same time whether or not the phone exists.
const DUMMY_HASH = "$2b$12$sQLsOeDX43g3TmdV7AfwZeTqT85H.5UT7tkpWOt8tBj670J8k54Su";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
  phone: user.phone,
});

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    throw badRequest("name, phone and password are required");
  }
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) throw conflict("Phone number already registered");

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // `role` is deliberately NOT read from the request body. It used to be, which
  // meant anyone could POST {"role":"admin"} to this public endpoint and mint
  // themselves an admin account. Admins are promoted directly in the database.
  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    role: "user",
    lastLogin: new Date(),
  });

  res.status(201).json({
    message: "Registration successful",
    token: signToken(user),
    user: publicUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw badRequest("phone and password are required");
  }

  const user = await User.findOne({ phone });

  // One generic message and one code path for "no such user" and "wrong
  // password". The old 404/400 split confirmed which phone numbers are
  // registered, and let an attacker enumerate the customer base.
  if (!user) {
    // Spend comparable time hashing so the response time does not leak
    // whether the account exists.
    await bcrypt.compare(String(password), DUMMY_HASH).catch(() => false);
    throw unauthorized("Invalid phone number or password");
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) throw unauthorized("Invalid phone number or password");

  if (user.isActive === false) {
    throw unauthorized("This account has been deactivated");
  }

  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    token: signToken(user),
    user: publicUser(user),
  });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) throw badRequest("phone is required");

  const user = await User.findOne({ phone });

  // Always the same response, whether or not the number is registered.
  const genericResponse = {
    message: "If that number is registered, a reset code has been sent.",
  };

  if (!user) return res.status(200).json(genericResponse);

  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store only a hash. A leaked database dump then cannot be used to reset
  // accounts, and the plaintext exists only in transit to the user.
  user.resetToken = hashResetToken(resetToken);
  user.resetTokenExpiration = Date.now() + RESET_TOKEN_TTL_MS;
  await user.save();

  // The token is NOT returned to the caller. It used to be, which meant
  // knowing someone's phone number was enough to take over their account.
  // TODO(Phase 0.3): deliver via SMS. Until a provider is wired up, the code
  // is logged server-side so staff can read it out; this is a stopgap, not a
  // delivery mechanism.
  console.info(
    `[password-reset] token for ${phone}: ${resetToken} (expires in ${
      RESET_TOKEN_TTL_MS / 60000
    }m)`
  );

  res.status(200).json(genericResponse);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw badRequest("token and newPassword are required");
  }
  if (String(newPassword).length < MIN_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const user = await User.findOne({
    resetToken: hashResetToken(token),
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) throw badRequest("Invalid or expired token");

  user.password = await bcrypt.hash(String(newPassword), BCRYPT_ROUNDS);
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset" });
});

/** Register (or refresh) this device's Expo push token for the signed-in user. */
const registerPushToken = asyncHandler(async (req, res) => {
  const { pushToken } = req.body;

  if (!pushToken || typeof pushToken !== "string") {
    throw badRequest("pushToken is required");
  }

  // addToSet keeps one entry per device without needing a read first.
  await User.updateOne(
    { _id: req.user.id },
    { $addToSet: { pushTokens: pushToken } }
  );

  res.status(200).json({ message: "Push token registered" });
});

/** The signed-in customer's own profile, including loyalty balance. */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password -resetToken -resetTokenExpiration -pushTokens")
    .populate({ path: "favourites", select: "name price image ratingAverage" });

  if (!user) throw badRequest("User not found");

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints ?? 0,
      favourites: user.favourites ?? [],
      savedAddresses: user.savedAddresses ?? [],
    },
  });
});

/** Add or remove a meal from the customer's favourites. */
const toggleFavourite = asyncHandler(async (req, res) => {
  const { mealId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) throw badRequest("User not found");

  const already = user.favourites?.some((id) => String(id) === String(mealId));

  await User.updateOne(
    { _id: user._id },
    already ? { $pull: { favourites: mealId } } : { $addToSet: { favourites: mealId } }
  );

  res.status(200).json({
    message: already ? "Removed from favourites" : "Added to favourites",
    isFavourite: !already,
  });
});

/** Staff: paginated customer list with lifetime value, for support calls. */
const listUsers = asyncHandler(async (req, res) => {
  const limit = Math.min(Number.parseInt(req.query.limit, 10) || 50, 200);
  const skip = Math.max(Number.parseInt(req.query.skip, 10) || 0, 0);
  const search = String(req.query.search ?? "").trim();

  const filter = search
    ? {
        $or: [
          { phone: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -resetToken -resetTokenExpiration -pushTokens")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "orders", select: "totalPrice status createdAt" }),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    count: users.length,
    users: users.map((user) => {
      const orders = user.orders ?? [];
      const completed = orders.filter((o) => o.status === "completed");
      return {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        orderCount: orders.length,
        completedCount: completed.length,
        lifetimeValue:
          Math.round(completed.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0) * 1000) /
          1000,
        savedAddresses: user.savedAddresses ?? [],
      };
    }),
  });
});

/** Staff: block or unblock a customer. */
const setUserActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") throw badRequest("isActive must be a boolean");

  // Refuse to lock out the last remaining admin.
  if (isActive === false) {
    const target = await User.findById(id);
    if (!target) throw badRequest("User not found");
    if (target.role === "admin") {
      const activeAdmins = await User.countDocuments({
        role: "admin",
        isActive: { $ne: false },
      });
      if (activeAdmins <= 1) {
        throw badRequest("Cannot deactivate the last active admin account");
      }
    }
  }

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select(
    "-password -resetToken -resetTokenExpiration"
  );
  if (!user) throw badRequest("User not found");

  res.status(200).json({
    message: isActive ? "Account reactivated" : "Account deactivated",
    user,
  });
});

export {
  getMe,
  toggleFavourite,
  register,
  login,
  requestPasswordReset,
  resetPassword,
  registerPushToken,
  listUsers,
  setUserActive,
};
