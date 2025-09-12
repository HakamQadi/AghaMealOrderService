import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import MealRouter from "./routes/MealsRouter.js";
import CategoryRouter from "./routes/CategoryRouter.js";
import orderRoutes from "./routes/OrderRouter.js";
import userRouter from "./routes/UserRoutes.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi");
});
app.use("/", userRouter);
app.use("/admin/meals", MealRouter);
app.use("/admin/categories", CategoryRouter);
app.use("/admin/orders", orderRoutes);

app.get("/ping", (req, res) => {
  res.send("Pong!");
});
setInterval(() => {
  fetch("https://foodapplication-o93v.onrender.com/ping")
    .then((res) => res.text())
    .then((data) => console.log("Self-ping success:", data))
    .catch((err) => console.error("Self-ping failed:", err));
}, 14 * 60 * 1000); // every 14 minutes
// }, 30 * 1000); // every 30 seconds

app.listen(PORT, () => {
  console.log(`started on http://localhost:${PORT}`);
});
