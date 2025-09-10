import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal/PopupModal";
import {
  Plus,
  ImageIcon,
  Utensils,
  DollarSign,
  Tag,
  Globe,
} from "lucide-react";

export default function Meal() {
  const [meals, setMeals] = useState([]);
  const [isModalopen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [mealNameEn, setMealNameEn] = useState("");
  const [mealNameAr, setMealNameAr] = useState("");
  const [mealCategoryId, setMealCategoryId] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  const [mealImage, setMealImage] = useState(null);

  const fileInputRef = useRef(null);

  const fetchMealsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/meals`
      );
      setMeals(response?.data?.meals);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("ERROR fetching categories:", error);
    }
  };

  const closeFunction = () => {
    setModalOpen(false);
  };

  const handleAddMeal = async () => {
    const formData = new FormData();
    formData.append("name.en", mealNameEn);
    formData.append("name.ar", mealNameAr);
    formData.append("categoryId", mealCategoryId);
    formData.append("price", mealPrice);
    formData.append("image", mealImage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/meals/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Meal added:", response.data);
      fetchMealsData();

      // Reset modal fields
      setMealNameEn("");
      setMealNameAr("");
      setMealCategoryId("");
      setMealPrice("");
      setMealImage(null);
      setModalOpen(false);
    } catch (error) {
      console.error("ERROR :: ", error.message);
    }
  };

  useEffect(() => {
    fetchMealsData();
    fetchCategories();
  }, []);

  return (
    <main className="">
      <section className="w-full max-w-7xl mx-auto">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3 hover:scale-105 transform transition-all duration-200">
              <div className="p-2 bg-slate-800 border border-cyan-500/30 rounded-lg">
                <Utensils className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-200 to-cyan-400 bg-clip-text text-transparent p-1">
                Meals
              </h1>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Meal</span>
            </button>
          </div>

          {isModalopen && (
            <Modal onClose={closeFunction}>
              <div className="p-6 bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-lg mx-auto">
                <div className="max-h-[80vh] overflow-y-auto space-y-6 pr-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1 bg-cyan-500/20 border border-cyan-500/30 rounded">
                      <Plus className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">
                      Add New Meal
                    </h1>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Name (English)
                        </label>
                        <input
                          type="text"
                          value={mealNameEn}
                          onChange={(e) => setMealNameEn(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter meal name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Name (Arabic)
                        </label>
                        <input
                          type="text"
                          value={mealNameAr}
                          onChange={(e) => setMealNameAr(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                          placeholder="أدخل اسم الوجبة"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category
                      </label>
                      <select
                        value={mealCategoryId}
                        onChange={(e) => setMealCategoryId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Price (JOD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={mealPrice}
                          onChange={(e) => setMealPrice(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter price"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Upload Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => setMealImage(e.target.files[0])}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    {mealImage && (
                      <div className="relative pt-2">
                        <img
                          src={
                            URL.createObjectURL(mealImage) || "/placeholder.svg"
                          }
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-xl mt-2 border border-slate-600/50"
                        />
                        <button
                          onClick={() => {
                            setMealImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute -top-0 -right-2 p-2 rounded-full bg-red-600/90 text-white shadow-md hover:bg-red-700 hover:shadow-lg transform hover:scale-110 transition-all duration-200 border border-white/20"
                          aria-label="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddMeal}
                    className="w-full mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Add Meal
                  </button>
                </div>
              </div>
            </Modal>
          )}

          <div className="overflow-x-auto bg-slate-800 rounded-xl">
            <div className="min-w-[600px]">
              <div className="bg-slate-700 rounded-t-xl p-4 border-b border-slate-600">
                <div className="grid grid-cols-4 gap-4 font-semibold text-slate-200">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    <span>Name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Price</span>
                  </div>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto bg-slate-800 rounded-b-xl">
                <div className="space-y-2 p-4">
                  {meals.map((meal) => (
                    <div
                      key={meal._id}
                      className="grid grid-cols-4 gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
                          {meal?.image ? (
                            <img
                              src={meal.image || "/placeholder.svg"}
                              alt="Meal"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Utensils className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-start">
                        <span className="text-slate-200 font-medium   px-2">
                          {meal?.name?.en || "Unnamed Meal"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-slate-300 text-center truncate px-2">
                          {meal?.category?.name?.en || "No Category"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-amber-400 font-bold text-center">
                          {meal.price} JOD
                        </span>
                      </div>
                    </div>
                  ))}

                  {meals.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                        <Utensils className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-lg">No meals found</p>
                      <p className="text-slate-500 text-sm mt-2">
                        Add your first meal to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
