import jwt from "jsonwebtoken";
import { unauthorized, forbidden } from "../utils/HttpError.js";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Previously this fell back to a hardcoded "supersecretkey", which meant a
    // misconfigured deploy silently accepted tokens anyone could mint.
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

export const signToken = (user) =>
  jwt.sign({ userId: String(user._id), role: user.role }, getSecret(), {
    expiresIn: "7d",
  });

/** Parse a Bearer token if present. Never throws; returns null when absent or invalid. */
export const readToken = (req) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
};

/** Attach req.user when a valid token is present, but never reject. */
export const optionalAuth = (req, _res, next) => {
  const payload = readToken(req);
  if (payload) req.user = { id: payload.userId, role: payload.role };
  next();
};

export const requireAuth = (req, _res, next) => {
  const payload = readToken(req);
  if (!payload) return next(unauthorized());
  req.user = { id: payload.userId, role: payload.role };
  next();
};

export const requireAdmin = [
  requireAuth,
  (req, _res, next) =>
    req.user.role === "admin" ? next() : next(forbidden("Admin access required")),
];

/**
 * Allow the request when the caller is the user named in `paramName`, or an
 * admin. Used so one customer cannot read another customer's orders.
 */
export const requireSelfOrAdmin = (paramName = "userId") => [
  requireAuth,
  (req, _res, next) => {
    if (req.user.role === "admin" || req.user.id === req.params[paramName]) {
      return next();
    }
    return next(forbidden());
  },
];
