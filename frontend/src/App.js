// import { Routes, Route } from "react-router-dom";
// import "./App.css";
// import Category from "./pages/Category/Category";
// import NavBar from "./components/NavBar/NavBar";
// import Meal from "./pages/Meal/Meal";
// import Home from "./pages/Home/Home";

// function App() {
//   return (
//     <>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="meal" element={<Meal />} />
//         <Route path="category" element={<Category />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Layout/Dashboard";
import Category from "./pages/Category/Category";
import Meal from "./pages/Meal/Meal";
// import Orders from "./pages/Orders/Orders";
// import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="category" element={<Category />} />
          <Route path="meal" element={<Meal />} />
          {/* <Route path="orders" element={<Orders />} /> */}
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
        </Route>
      </Route>
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
}

export default App;
