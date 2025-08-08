import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AUTHORIZED_EMAILS = ["pt74009@gmail.com", "duyphuctran.it@gmail.com"];

export function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();

  console.log("🔐 ProtectedRoute - Current user:", currentUser?.email);
  console.log("🔐 AdminOnly:", adminOnly);

  if (!currentUser) {
    console.log("❌ No user - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !AUTHORIZED_EMAILS.includes(currentUser.email)) {
    console.log("⛔ User not admin:", currentUser.email);
    alert("Bạn không có quyền truy cập trang quản trị!");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Access granted");
  return children;
}
