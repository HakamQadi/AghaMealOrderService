import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const mealSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageFileIds: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    image: {
      type: String,
      required: true,
    },
    imageFileIds: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      en: { type: String, required: false },
      ar: { type: String, required: false },
    },
  },
  { timestamps: true }
);

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
