import { Navigate } from "react-router-dom";
import { UseAppContext } from "../context/UseAppContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, roleLoading } = UseAppContext();

  if (roleLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <span className="inline-block size-4 border-2 border-primary-dull border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (allowedRoles.includes(role)) return children;

  if (role === "seller") return <Navigate to="/seller/dashboard" replace />;
  return <Navigate to="/" replace />;
};
