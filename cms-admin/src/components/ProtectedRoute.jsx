import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("cmsToken");
  const admin = JSON.parse(localStorage.getItem("cmsAdmin"));

  if (!token || !admin || admin.role !== "admin") {
    return <Navigate to="/auth-required" replace />;
  }

  return children;
}

export default ProtectedRoute;