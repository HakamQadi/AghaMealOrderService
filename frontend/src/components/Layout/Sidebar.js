// // import { NavLink, useNavigate } from "react-router-dom";
// // import {
// //   TagIcon,
// //   CubeIcon,
// //   ShoppingBagIcon,
// //   ArrowRightOnRectangleIcon,
// //   BanknotesIcon,
// //   QuestionMarkCircleIcon,
// //   LanguageIcon,
// // } from "@heroicons/react/24/outline";

// // const navigation = [
// //   { name: "Categories", href: "/dashboard/categories", icon: TagIcon },
// //   { name: "Items", href: "/dashboard/items", icon: CubeIcon },
// //   { name: "Orders", href: "/dashboard/orders", icon: ShoppingBagIcon },
// //   { name: "Coupons", href: "/dashboard/coupons", icon: BanknotesIcon },
// //   { name: "FAQs", href: "/dashboard/faq", icon: QuestionMarkCircleIcon },
// //   { name: "Translation", href: "/dashboard/translation", icon: LanguageIcon },
// // ];

// // const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     navigate("/login");
// //   };

// //   return (
// //     <>
// //       {/* Mobile sidebar overlay */}
// //       {sidebarOpen && (
// //         <div className="fixed inset-0 flex z-40 md:hidden">
// //           <div
// //             className="fixed inset-0 bg-gray-600 bg-opacity-75"
// //             onClick={() => setSidebarOpen(false)}
// //           />
// //           <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
// //             <SidebarContent
// //               navigation={navigation}
// //               handleLogout={handleLogout}
// //               setSidebarOpen={setSidebarOpen}
// //             />
// //           </div>
// //         </div>
// //       )}

// //       {/* Desktop sidebar */}
// //       <div className="hidden md:flex md:flex-shrink-0">
// //         <div className="flex flex-col w-64">
// //           <div className="flex flex-col h-0 flex-1 bg-white shadow">
// //             <SidebarContent
// //               navigation={navigation}
// //               handleLogout={handleLogout}
// //               setSidebarOpen={setSidebarOpen}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // const SidebarContent = ({
// //   navigation,
// //   handleLogout,
// //   setSidebarOpen = () => {},
// // }) => (
// //   <>
// //     <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
// //       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
// //         <span className="text-blue-600 font-bold text-lg">A</span>
// //       </div>
// //       <span className="text-white font-semibold text-lg">Admin Panel</span>
// //     </div>
// //     <div className="flex-1 flex flex-col overflow-y-auto">
// //       <nav className="flex-1 px-2 py-4 space-y-1">
// //         {navigation.map((item) => (
// //           <NavLink
// //             onClick={() => setSidebarOpen(false)}
// //             key={item.name}
// //             to={item.href}
// //             className={({ isActive }) =>
// //               `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
// //                 isActive
// //                   ? "bg-blue-100 text-blue-900"
// //                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
// //               }`
// //             }
// //           >
// //             <item.icon className="mr-3 h-6 w-6" />
// //             {item.name}
// //           </NavLink>
// //         ))}
// //       </nav>
// //       <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
// //         <button
// //           onClick={handleLogout}
// //           className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
// //         >
// //           <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
// //           Logout
// //         </button>
// //       </div>
// //     </div>
// //   </>
// // );

// // export default Sidebar;

// export default function NavBar() {
//   return (
//     <div className="fixed left-0 top-0 h-full w-full md:w-80 lg:w-72 xl:w-64 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl z-50 md:relative">
//       <div className="pt-8 pb-6 px-6">
//         <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-2 tracking-wide">
//           Agha Meal
//         </h1>
//         <h2 className="text-yellow-400 text-lg md:text-xl font-semibold text-center">
//           Dashboard
//         </h2>
//       </div>

//       <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-6 mb-8"></div>

//       <nav className="px-4 space-y-2">
//         <a
//           className="flex items-center justify-center w-full h-14 text-white text-lg font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
//           href="/"
//         >
//           <span className="mr-3">🏠</span>
//           Home
//         </a>
//         <a
//           className="flex items-center justify-center w-full h-14 text-white text-lg font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
//           href="/meal"
//         >
//           <span className="mr-3">🍽️</span>
//           Meal
//         </a>
//         <a
//           className="flex items-center justify-center w-full h-14 text-white text-lg font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
//           href="/category"
//         >
//           <span className="mr-3">📂</span>
//           Category
//         </a>
//       </nav>
//     </div>
//   );
// }

import { NavLink, useNavigate } from "react-router-dom";
import {
  TagIcon,
  CubeIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Category", href: "/category", icon: TagIcon },
  { name: "Meal", href: "/meal", icon: CubeIcon },
  // { name: "Orders", href: "/dashboard/orders", icon: ShoppingBagIcon },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <SidebarContent
              navigation={navigation}
              handleLogout={handleLogout}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow">
            <SidebarContent
              navigation={navigation}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarContent = ({
  navigation,
  handleLogout,
  setSidebarOpen = () => {},
}) => (
  <>
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
      <span className="text-white font-semibold text-lg">Admin Panel</span>
    </div>
    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
          Logout
        </button>
      </div>
    </div>
  </>
);

export default Sidebar;
