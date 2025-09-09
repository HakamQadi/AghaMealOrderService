// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Style } from "./style";
// import axios from "axios";
// import { Colors } from "../../themes/Colors";

// export default function Home() {
//   const [mealsLength, setMealsLength] = useState([]);
//   const [categoriesLength, setCategoriesLength] = useState([]);

//   const fetchMealsData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/meals`
//       );
//       setMealsLength(response?.data?.count);
//     } catch (error) {
//       // TODO Toast HERE!!!
//       console.error("ERROR :: ", error.response || error.message);
//     }
//   };

//   const fetchCategoriesData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
//       );
//       setCategoriesLength(response?.data?.count);
//     } catch (error) {
//       console.error("ERROR :: ", error.response || error.message);
//     }
//   };

//   useEffect(() => {
//     fetchMealsData();
//     fetchCategoriesData();
//   }, []);
//   return (
//     <main className="contentContainer">
//       <section
//         style={{
//           backgroundColor: Colors.darkGray,
//           width: "80%",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <div
//           style={{
//             height: "50%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 300,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: Colors.darkBlue,
//               color: Colors.white,
//               width: "20%",
//               height: "50%",
//               alignContent: "center",
//               textAlign: "center",
//               borderRadius: 20,
//             }}
//           >
//             <h3>
//               Meals Count{" "}
//               <span style={{ color: Colors.yellow }}>{mealsLength}</span>
//             </h3>
//           </div>
//           <div
//             style={{
//               backgroundColor: Colors.darkBlue,
//               color: Colors.white,
//               width: "20%",
//               height: "50%",
//               alignContent: "center",
//               textAlign: "center",
//               borderRadius: 20,
//             }}
//           >
//             <h3>
//               Categories Count{" "}
//               <span style={{ color: Colors.yellow }}>{categoriesLength}</span>
//             </h3>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [mealsLength, setMealsLength] = useState([]);
  const [categoriesLength, setCategoriesLength] = useState([]);

  const fetchMealsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/meals`
      );
      setMealsLength(response?.data?.count);
    } catch (error) {
      // TODO Toast HERE!!!
      console.error("ERROR :: ", error.response || error.message);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
      );
      setCategoriesLength(response?.data?.count);
    } catch (error) {
      console.error("ERROR :: ", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchMealsData();
    fetchCategoriesData();
  }, []);

  return (
    <main className="  from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 text-center mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 text-center text-lg">
            Monitor your meals and categories at a glance
          </p>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Meals Count Card */}
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-slate-200 hover:border-blue-200 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-2">
                    Total Meals
                  </h3>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">
                    {mealsLength}
                  </div>
                  <p className="text-slate-500 text-sm md:text-base">
                    Available meals in your system
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Count Card */}
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-slate-200 hover:border-amber-200 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-2">
                    Categories
                  </h3>
                  <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-1">
                    {categoriesLength}
                  </div>
                  <p className="text-slate-500 text-sm md:text-base">
                    Organized meal categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        {/* <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-slate-600 text-sm">System Status: Active</span>
          </div>
        </div> */}
      </div>
    </main>
  );
}
