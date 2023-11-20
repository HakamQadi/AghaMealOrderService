import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
// import userRoute from "./routes/userRoute.js";
// import recipesRoute from "./routes/recipesRoute.js";
import Dashboard from "./admin/admin.js";
import MealRouter from "./routes/MealsRouter.js";
// const MealRouter = require("./routes/MealsRouter.js");
const { admin, adminRouter } = Dashboard;
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("home");
// });
app.use("/admin/meals",MealRouter );

// app.use("/api/user", userRoute);
// app.use("/api/recipes", recipesRoute);
app.use(admin.options.rootPath, adminRouter);

app.listen(PORT, () => {
  console.log(`fro api http://127.0.0.1:${PORT}
    AdminJS started on http://localhost:${PORT}${admin.options.rootPath}
    `);
});
