import express from "express";
import cors from "cors";

import MealRouter from "./routes/MealsRouter.js";
import CategoryRouter from "./routes/CategoryRouter.js";
import orderRoutes from "./routes/OrderRouter.js";
import userRouter from "./routes/UserRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

/**
 * Build the Express app without listening on a port, so tests can drive it
 * directly. server.js owns the listening and the database connection.
 *
 * (This file previously held an unwired AdminJS scaffold that nothing started.)
 */
export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => res.send("Hi"));
  app.get("/ping", (_req, res) => res.send("Pong!"));
  app.get("/health", (_req, res) =>
    res.status(200).json({ status: "ok", uptime: process.uptime() })
  );

  app.use("/", userRouter);

  // Menu reads are public; writes are admin-only (see each router).
  app.use(["/meals", "/admin/meals"], MealRouter);
  app.use(["/categories", "/admin/categories"], CategoryRouter);
  app.use("/admin/orders", orderRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
