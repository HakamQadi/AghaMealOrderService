// import React, { useEffect, useState } from "react";
// import { Style } from "./style";
// import axios from "axios";
// import Modal from "../../components/Modal/PopupModal";

// export default function Meal() {
//   const [meals, setMeals] = useState([]);
//   const [isModalopen, setModalOpen] = useState(false);

//   const [mealName, setMealName] = useState("");
//   const [mealCategory, setMealCategory] = useState("");
//   // const [mealPrice, setMealPrice] = useState("");
//   // const [mealImage, setMealImage] = useState("");
//   // const [mealImage, setMealImage] = useState(null); // State to hold the selected image file

//   const fetchMealsData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/meals`
//       );
//       setMeals(response?.data?.meals);
//     } catch (error) {
//       // TODO Toast HERE!!!
//       console.error("ERROR :: ", error);
//     }
//   };

//   const closeFunction = () => {
//     setModalOpen(false);
//   };

//   // // const handleAddMeal = async () => {
//   // //   const newMeal = {
//   // //     meal: mealName,
//   // //     category: mealCategory,
//   // //     price: mealPrice,
//   // //     image: mealImage,
//   // //   };

//   // //   try {
//   // //     await axios.post("http://localhost:8080/upload", newMeal);
//   // //     // await axios.post("http://localhost:8080/admin/meals/add", newMeal);
//   // //     setModalOpen(false);
//   // //     fetchMealsData();
//   // //     // Reset states
//   // //     setMealName("");
//   // //     setMealCategory("");
//   // //     setMealPrice("");
//   // //     setMealImage("");
//   // //   } catch (error) {
//   // //     // Handle error here
//   // //     console.error("ERROR :: ", error);
//   // //   }
//   // // };

//   // const handleAddMeal = async () => {
//   //   const formData = new FormData(); // Create a FormData object to append the meal data
//   //   formData.append("meal", mealName);
//   //   formData.append("category", mealCategory);
//   //   formData.append("price", mealPrice);
//   //   formData.append("image", mealImage); // Append the image file

//   //   try {
//   //     const response = await axios.post(
//   //        `${process.env.REACT_APP_API_BASE_URL}/admin/meals/add`,
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       }
//   //     );
//   //     console.log(response.data);
//   //     fetchMealsData();
//   //     // Reset states
//   //     setMealName("");
//   //     setMealCategory("");
//   //     setMealPrice("");
//   //     setMealImage(null);

//   //     setModalOpen(false);
//   //   } catch (error) {
//   //     console.error("ERROR :: ", error.message);
//   //   }
//   // };

//   const [mealNameEn, setMealNameEn] = useState("");
//   const [mealNameAr, setMealNameAr] = useState("");
//   const [mealCategoryId, setMealCategoryId] = useState("");
//   const [mealPrice, setMealPrice] = useState("");
//   const [mealImage, setMealImage] = useState(null);

//   const handleAddMeal = async () => {
//     const formData = new FormData();
//     formData.append("name.en", mealNameEn);
//     formData.append("name.ar", mealNameAr);
//     formData.append("categoryId", mealCategoryId);
//     formData.append("price", mealPrice);
//     formData.append("image", mealImage);

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/meals/add`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       console.log("Meal added:", response.data);
//       fetchMealsData();

//       // Reset modal fields
//       setMealNameEn("");
//       setMealNameAr("");
//       setMealCategoryId("");
//       setMealPrice("");
//       setMealImage(null);
//       setModalOpen(false);
//     } catch (error) {
//       console.error("ERROR :: ", error.message);
//     }
//   };

//   const [categories, setCategories] = useState([]);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
//       );
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error("ERROR fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMealsData();
//     fetchCategories();
//   }, []);
//   // }, [isModalopen]);
//   // }, [fetchMealsData()]);

//   return (
//     <main className="contentContainer ">
//       <section style={Style.container}>
//         <div className="container">
//           <div style={Style.headerContainer}>
//             <h1 style={Style.headerText}>Meals</h1>
//             <button
//               onClick={() => setModalOpen(true)}
//               className="navItem"
//               href="#"
//               style={Style.addButton}
//             >
//               <p style={{ margin: 0 }}>Add</p>
//             </button>
//           </div>
//           {isModalopen && (
//             <Modal onClose={closeFunction}>
//               <div style={Style.modalContainer}>
//                 <h1>Add New Meal</h1>
//                 <div style={Style.inputsContainer}>
//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Name (EN)</p>
//                     <input
//                       type="text"
//                       value={mealNameEn}
//                       onChange={(e) => setMealNameEn(e.target.value)}
//                     />
//                   </div>
//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Name (AR)</p>
//                     <input
//                       type="text"
//                       value={mealNameAr}
//                       onChange={(e) => setMealNameAr(e.target.value)}
//                     />
//                   </div>

//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Category</p>
//                     <select
//                       value={mealCategoryId}
//                       onChange={(e) => setMealCategoryId(e.target.value)}
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((cat) => (
//                         <option key={cat._id} value={cat._id}>
//                           {cat.name.en}
//                           {/* or cat.name.ar if you want Arabic */}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Price</p>
//                     <input
//                       type="text"
//                       value={mealPrice}
//                       onChange={(e) => setMealPrice(e.target.value)}
//                     />
//                   </div>

//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Image</p>
//                     <input
//                       type="file"
//                       onChange={(e) => setMealImage(e.target.files[0])}
//                     />
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleAddMeal}
//                   className="navItem"
//                   href="#"
//                   style={Style.addButton}
//                 >
//                   <p style={{ margin: 0 }}>Add</p>
//                 </button>
//               </div>
//             </Modal>
//           )}
//           <div style={Style.tabelHeader}>
//             <div style={Style.itemText}>Image</div>
//             <div style={Style.itemText}>Name</div>
//             <div style={Style.itemText}>Category</div>
//             <div style={Style.itemText}>Price</div>
//           </div>
//           <div
//             className="scroll-container"
//             style={{ height: "80vh", overflowY: "scroll" }}
//           >
//             {meals.map((meal) => {
//               return (
//                 <div style={Style.itemContainer} key={meal._id}>
//                   <div style={Style.imageContainer}>
//                     <img src={meal?.image} alt="Meal" style={Style.image} />
//                   </div>
//                   {meal?.name?.en ? (
//                     <div style={Style.itemText}>{meal?.name?.en}</div>
//                   ) : null}
//                   {meal?.category?.name ? (
//                     <div style={Style.itemText}>{meal?.category?.name?.en}</div>
//                   ) : null}
//                   <div style={Style.priceText}>{meal.price} JOD</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Modal from "../../components/Modal/PopupModal"
import { Plus, ImageIcon, Utensils, DollarSign, Tag, Globe } from "lucide-react"

export default function Meal() {
  const [meals, setMeals] = useState([])
  const [isModalopen, setModalOpen] = useState(false)
  const [categories, setCategories] = useState([])

  const [mealNameEn, setMealNameEn] = useState("")
  const [mealNameAr, setMealNameAr] = useState("")
  const [mealCategoryId, setMealCategoryId] = useState("")
  const [mealPrice, setMealPrice] = useState("")
  const [mealImage, setMealImage] = useState(null)

  const fetchMealsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/meals`)
      setMeals(response?.data?.meals)
    } catch (error) {
      console.error("ERROR :: ", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/categories`)
      setCategories(response.data.categories)
    } catch (error) {
      console.error("ERROR fetching categories:", error)
    }
  }

  const closeFunction = () => {
    setModalOpen(false)
  }

  const handleAddMeal = async () => {
    const formData = new FormData()
    formData.append("name.en", mealNameEn)
    formData.append("name.ar", mealNameAr)
    formData.append("categoryId", mealCategoryId)
    formData.append("price", mealPrice)
    formData.append("image", mealImage)

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/meals/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Meal added:", response.data)
      fetchMealsData()

      // Reset modal fields
      setMealNameEn("")
      setMealNameAr("")
      setMealCategoryId("")
      setMealPrice("")
      setMealImage(null)
      setModalOpen(false)
    } catch (error) {
      console.error("ERROR :: ", error.message)
    }
  }

  useEffect(() => {
    fetchMealsData()
    fetchCategories()
  }, [])

  return (
    <main className="">
      <section className="w-full max-w-7xl mx-auto">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Meals
              </h1>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Meal</span>
            </button>
          </div>

          {isModalopen && (
            <Modal onClose={closeFunction}>
              <div className="p-6 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Add New Meal</h1>
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
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter meal name in English"
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
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="أدخل اسم الوجبة بالعربية"
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name.en}
                        </option>
                      ))}
                    </select>
                  </div>

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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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
                      onChange={(e) => setMealImage(e.target.files[0])}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddMeal}
                  className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Add Meal
                </button>
              </div>
            </Modal>
          )}

          <div className="bg-slate-700 rounded-t-xl p-4 border-b border-slate-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-semibold text-slate-200">
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Utensils className="w-4 h-4" />
                <span className="hidden sm:inline">Name</span>
              </div>
              <div className="hidden md:flex items-center justify-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </div>
              <div className="hidden md:flex items-center justify-center gap-2">
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
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
                      {meal?.image ? (
                        <img src={meal.image || "/placeholder.svg"} alt="Meal" className="w-full h-full object-cover" />
                      ) : (
                        <Utensils className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <span className="text-slate-200 font-medium text-center truncate px-2">
                      {meal?.name?.en || "Unnamed Meal"}
                    </span>
                    {meal?.name?.ar && (
                      <span className="text-slate-400 text-sm text-center truncate px-2" dir="rtl">
                        {meal.name.ar}
                      </span>
                    )}
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-slate-300 text-center truncate px-2">
                      {meal?.category?.name?.en || "No Category"}
                    </span>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-center">{meal.price} JOD</span>
                  </div>

                  {/* Mobile-only price and category display */}
                  <div className="md:hidden flex flex-col justify-center items-center">
                    <span className="text-yellow-400 font-bold text-sm">{meal.price} JOD</span>
                    <span className="text-slate-400 text-xs text-center truncate">
                      {meal?.category?.name?.en || "No Category"}
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
                  <p className="text-slate-500 text-sm mt-2">Add your first meal to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
