// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Style } from "./style";
// import Modal from "../../components/Modal/PopupModal";

// function Category() {
//   const [categories, setCategories] = useState([]);
//   const [isModalopen, setModalOpen] = useState(false);

//   const [categoryName, setCategoryName] = useState("");
//   const [categoryImage, setCategoryImage] = useState("");

//   const fetchCategoriesData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
//       );
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error("ERROR :: ", error);
//     }
//   };

//   const closeFunction = () => {
//     setModalOpen(false);
//   };

//   const handleAddMeal = async () => {
//     const newCategory = {
//       name: categoryName,
//       image: categoryImage,
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/categories/add`,
//         newCategory
//       );
//       setModalOpen(false);
//       fetchCategoriesData();

//       // Reset states
//       setCategoryName("");
//       setCategoryImage("");
//     } catch (error) {
//       console.error("ERROR :: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategoriesData();
//   }, [isModalopen]);

//   return (
//     <main className="contentContainer ">
//       <section style={Style.container}>
//         <div className="container">
//           <div style={Style.headerContainer}>
//             <h1 style={Style.headerText}>Categories</h1>
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
//                 <h1>Add New Category</h1>
//                 <div style={Style.inputsContainer}>
//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Name</p>
//                     <input
//                       type="text"
//                       value={categoryName}
//                       onChange={(e) => setCategoryName(e.target.value)}
//                     />
//                   </div>
//                   <div style={Style.input}>
//                     <p style={{ margin: 0 }}>Image</p>
//                     {/* <input
//                       style={{
//                         width: "50%",
//                       }}
//                       type="file"
//                     /> */}
//                     <input
//                       type="text"
//                       value={categoryImage}
//                       onChange={(e) => setCategoryImage(e.target.value)}
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
//           </div>
//           <div
//             className="scroll-container"
//             style={{ height: "80vh", overflowY: "scroll" }}
//           >
//             {categories.map((category) => {
//               return (
//                 <div style={Style.itemContainer} key={category._id}>
//                   <div style={Style.imageContainer}>
//                     <img
//                       src={category?.image}
//                       alt="Category"
//                       style={Style.image}
//                     />
//                   </div>
//                   <div style={Style.itemText}>{category?.name?.en}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default Category;

import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal/PopupModal";
import { Plus, ImageIcon, Tag, FileText } from "lucide-react";

function Category() {
  const [categories, setCategories] = useState([]);
  const [isModalopen, setModalOpen] = useState(false);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  const closeFunction = () => {
    setModalOpen(false);
  };

  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("name.en", nameEn);
    formData.append("name.ar", nameAr);
    formData.append("description.en", descEn);
    formData.append("description.ar", descAr);
    formData.append("image", categoryImage);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/categories/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setModalOpen(false);
      fetchCategoriesData();

      // Reset states
      setNameEn("");
      setNameAr("");
      setDescEn("");
      setDescAr("");
      setCategoryImage(null);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [isModalopen]);

  return (
    <main className="">
      <section className="w-full max-w-7xl mx-auto">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Categories
              </h1>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>

          {isModalopen && (
            <Modal onClose={closeFunction}>
              <div className="p-6 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Plus className="w-5 h-5 text-white" />
                  Add New Category
                </h1>

                {/* Name EN */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Name (EN)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category name in English"
                  />
                </div>

                {/* Name AR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Name (AR)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category name in Arabic"
                  />
                </div>

                {/* Description EN */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description (EN)
                  </label>
                  <textarea
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category description in English"
                  />
                </div>

                {/* Description AR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description (AR)
                  </label>
                  <textarea
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category description in Arabic"
                  />
                </div>

                {/* Upload Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryImage(e.target.files[0])}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {/* Optional: live preview */}
                  {categoryImage && (
                    <img
                      src={URL.createObjectURL(categoryImage)}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-xl mt-2"
                    />
                  )}
                </div>

                <button
                  onClick={handleAddCategory}
                  className="w-full mt-4 px-6 py-3 bg-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Add Category
                </button>
              </div>
            </Modal>
          )}

          {/* Categories List */}
          <div className="bg-slate-700 rounded-t-xl p-4 border-b border-slate-600">
            <div className="grid grid-cols-2 gap-4 font-semibold text-slate-200">
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="hidden sm:inline">Name</span>
              </div>
            </div>
          </div>

          <div className="max-h-[50vh] overflow-y-auto bg-slate-800 rounded-b-xl">
            <div className="space-y-2 p-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="grid grid-cols-2 gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
                      {category?.image ? (
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt="Category"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-slate-200 font-medium text-center truncate px-2">
                      {category?.name?.en || "Unnamed Category"}
                    </span>
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                    <Tag className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg">No categories found</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Add your first category to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Category;
