import { HttpError } from "../utils/HttpError.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars -- Express identifies the error
// handler by arity, so `next` must stay in the signature.
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Mongoose validation / bad ObjectId are client errors, not server faults.
  if (err?.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed", details: err.message });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Already exists" });
  }

  // body-parser rejects malformed JSON and oversized payloads with its own
  // 4xx status. Without this they fell through to a 500, reporting a client
  // mistake as a server fault.
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON in request body" });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body too large" });
  }

  console.error(`Unhandled error on ${req.method} ${req.originalUrl}:`, err);
  // Never echo the raw error to the client — CategoryController used to return
  // the whole error object, leaking internals.
  res.status(500).json({ message: "Internal server error" });
};

/** Wrap an async handler so a rejected promise reaches the error handler. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
