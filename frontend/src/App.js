import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Layout/Dashboard";
import Category from "./pages/Category/Category";
import Meal from "./pages/Meal/Meal";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="category" element={<Category />} />
          <Route path="meal" element={<Meal />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
