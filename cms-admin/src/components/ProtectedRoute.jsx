import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("cmsToken");
  const adminData = localStorage.getItem("cmsAdmin");

  let admin = null;

  try {
    admin = adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error("Invalid admin data:", error);
    localStorage.removeItem("cmsAdmin");
  }

  if (!token || !admin || admin.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;