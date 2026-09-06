import { HttpError } from "../utils/HttpError.js";

/**
 * Minimal fixed-window rate limiter held in process memory.
 *
 * Deliberately dependency-free. The limitation is that it is per-process, so
 * it does not hold across multiple Render instances — good enough to stop
 * credential stuffing and reset-code brute force on a single-instance deploy,
 * and the interface stays the same if it is later backed by Redis.
 */
export const rateLimit = ({ windowMs = 60_000, max = 10, keyFn } = {}) => {
  const hits = new Map();

  const sweep = () => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  };
  const timer = setInterval(sweep, windowMs);
  timer.unref?.();

  return (req, _res, next) => {
    const key = keyFn ? keyFn(req) : req.ip;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return next(
        new HttpError(429, `Too many requests. Try again in ${retryAfter}s.`)
      );
    }
    next();
  };
};

/** Limit by phone number where one is supplied, so one attacker cannot lock
 *  out every user behind a shared NAT, and cannot brute force one account by
 *  rotating source IPs. */
export const phoneKey = (req) => `${req.ip}:${req.body?.phone ?? ""}`;
