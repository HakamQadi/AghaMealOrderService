// import React from "react";
// import { Style } from "./style";

// export default function NavBar() {
//   return (
//     <div className="sidenav" style={Style.container}>
//       <h1 style={Style.headerOneText}>Agha Meal</h1>
//       <h2 style={Style.headerTwoText}>Dashboard</h2>
//       <span style={Style.divider}></span>
//       <a className="navItem" style={Style.navItem} href="/">
//         Home
//       </a>
//       <a className="navItem" style={Style.navItem} href="/meal">
//         Meal
//       </a>
//       <a className="navItem" href="/category" style={Style.navItem}>
//         Category
//       </a>
//     </div>
//   );
// }

export default function NavBar() {
  return (
    <div className="fixed left-0 top-0 h-full w-full md:w-80 lg:w-72 xl:w-64 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl z-50 md:relative">
      <div className="pt-8 pb-6 px-6">
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-2 tracking-wide">
          Agha Meal
        </h1>
        <h2 className="text-yellow-400 text-lg md:text-xl font-semibold text-center">
          Dashboard
        </h2>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-6 mb-8"></div>

      <nav className="px-4 space-y-2">
        <a
          className="flex items-center justify-center w-full h-14 text-white text-lg font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
          href="/"
        >
          <span className="mr-3">🏠</span>
          Home
        </a>
        <a
          className="flex items-center justify-center w-full h-14 text-white text-lg font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
          href="/meal"
        >
          <span className="mr-3">🍽️</span>
          Meal
        </a>
        <a
          className="flex items-center justify-center w-full h-14 text-white text-lg font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
          href="/category"
        >
          <span className="mr-3">📂</span>
          Category
        </a>
      </nav>
    </div>
  );
}