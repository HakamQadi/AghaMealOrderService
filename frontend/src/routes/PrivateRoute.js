import {jwtDecode} from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

const PrivateRoute = () => {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = token && isTokenValid(token);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
