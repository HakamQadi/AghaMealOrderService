import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const readToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp <= Date.now() / 1000) return null;
    return decoded;
  } catch {
    return null;
  }
};

const PrivateRoute = () => {
  const decoded = readToken(localStorage.getItem("authToken"));

  // Both checks matter: a valid token proves who you are, the role claim
  // decides whether you belong in the dashboard. Only expiry was checked
  // before, so any customer's token opened every page.
  if (!decoded || decoded.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
