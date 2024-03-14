import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import MealRouter from "./routes/MealsRouter.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/admin", MealRouter);

app.listen(PORT, () => {
  console.log(`started on http://localhost:${PORT}`);
});
