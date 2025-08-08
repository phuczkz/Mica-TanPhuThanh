import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Admin.css";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Kiểm tra quyền admin
      const adminEmails = [
        "pt74009@gmail.com",
        "duyphuctran.it@gmail.com",
        "micatanthanh@gmail.com",
      ];
      if (!adminEmails.includes(user.email)) {
        alert("Bạn không có quyền truy cập trang quản trị!");
        await auth.signOut();
        setLoading(false);
        navigate("/login");
        return;
      }

      console.log("Đăng nhập thành công:", user.email);

      // Chuyển hướng đến trang admin
      navigate("/admin");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Lỗi đăng nhập: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ marginBottom: "20px", color: "#333" }}>🔐 Đăng nhập</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Sử dụng tài khoản Google để đăng nhập
        </p>
        {/* Thông báo cảnh báo */}
        <div
          style={{
            background: "linear-gradient(135deg, #fff3cd, #ffeaa7)",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#856404",
          }}
        >
          ⚠️ <strong>Lưu ý:</strong> Chỉ nhà phát triển mới có quyền truy cập hệ
          thống quản lý
        </div>
        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : <>📧 Đăng nhập bằng Google</>}
        </button>

        <div style={{ marginTop: "20px" }}>
          <a
            href="/"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
