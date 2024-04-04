import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const mealSchema = new mongoose.Schema({
  meal: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  price: Number,
  image: String,
});

const categorySchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Meal = mongoose.model("Meal", mealSchema);
const Category = mongoose.model("Category", categorySchema);

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

export { Meal, Category };
