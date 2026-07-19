import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  role,
}) => {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  // Not Logged In
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Owner Only Route
  if (
    role === "owner" &&
    user?.role !== "owner"
  ) {
    return <Navigate to="/" replace />;
  }

  // Customer Route
  // Customer + Owner both allowed
  if (
    role === "customer" &&
    !["customer", "owner"].includes(
      user?.role
    )
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;