// import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

// const isTokenValid = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     return decoded.exp > currentTime;
//   } catch {
//     return false;
//   }
// };

const PrivateRoute = () => {
  // const token = localStorage.getItem("token");
  // const isAuthenticated = token && isTokenValid(token);

  return <Outlet />;
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
