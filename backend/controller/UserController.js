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

export { register, login, requestPasswordReset, resetPassword };
