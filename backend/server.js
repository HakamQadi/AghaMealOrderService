import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import MealRouter from "./routes/MealsRouter.js";
import CategoryRouter from "./routes/CategoryRouter.js";
const app = express();
const PORT = process.env.PORT || 3000;
// const fileUpload = require('express-fileupload');
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
import { dirname } from "path"; // Import dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000,
    },
    abortOnLimit: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "./controller/upload")));

// app.post("/upload", (req, res) => {
//   // Get the file that was set to our field named "image"
//   const { image } = req.files;

//   // If no image submitted, exit
//   if (!image)
//     return res.status(400).json({
//       message: "no image submitted",
//     });
//   image.mv(__dirname + "/upload/" + image.name);

//   // All good
//   res.status(200).json({
//     message: "All good",
//   });
// });
app.get("/", (req, res) => {
  res.send("Hi");
});
app.use("/admin/meals", MealRouter);
app.use("/admin/categories", CategoryRouter);

app.listen(PORT, () => {
  console.log(`started on http://localhost:${PORT}`);
});
