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
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-600">
      <span className="text-white font-semibold text-lg">
        Agha Meal Dashboard
      </span>
    </div>
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-800">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-600 hover:text-white"
              }`
            }
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="flex-shrink-0 flex border-t border-slate-400 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium   rounded-md text-slate-400 hover:bg-slate-600 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
          Logout
        </button>
      </div>
    </div>
  </>
);

export default Sidebar;
