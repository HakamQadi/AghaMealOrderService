import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const requireEnv = (keys) => {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
};

/**
 * Render's free tier idles an instance after 15 minutes. The self-ping keeps it
 * warm — but it used to run in every environment, so local development kept
 * waking the production instance.
 */
const startKeepAlive = () => {
  const url = process.env.SELF_PING_URL;
  if (!IS_PRODUCTION || !url) return;

  setInterval(() => {
    fetch(`${url.replace(/\/$/, "")}/ping`)
      .then((res) => res.text())
      .then((data) => console.log("Self-ping success:", data))
      .catch((err) => console.error("Self-ping failed:", err.message));
  }, 14 * 60 * 1000);
};

const start = async () => {
  requireEnv(["CONN_STR", "JWT_SECRET"]);

  if (process.env.ALLOW_LEGACY_UNAUTHED_ORDERS === "true") {
    console.warn(
      "⚠️  ALLOW_LEGACY_UNAUTHED_ORDERS=true — orders can be placed without a " +
        "token. This is a temporary app-rollout setting; unset it once clients " +
        "send Authorization headers."
    );
  }

  await connectDB();

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`started on http://localhost:${PORT}`);
  });

  startKeepAlive();

  const shutdown = (signal) => () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown("SIGTERM"));
  process.on("SIGINT", shutdown("SIGINT"));
};

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
