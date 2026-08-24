import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

  const { user, isLoggedIn } = useAuth();

  // User logged in nahi hai
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // User admin nahi hai
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin hai
  return children;
}

export default AdminRoute;