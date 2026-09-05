import mongoose from "mongoose";

/**
 * Connect to MongoDB. Called explicitly from server.js so that importing a
 * model never opens a socket as a side effect (which made the models
 * untestable and connected once per process regardless of context).
 */
export const connectDB = async (uri = process.env.CONN_STR) => {
  if (!uri) {
    throw new Error("CONN_STR is not set — cannot connect to MongoDB");
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  await mongoose.connect(uri);
  console.log("DB connected");
  return mongoose.connection;
};

export const disconnectDB = () => mongoose.disconnect();
