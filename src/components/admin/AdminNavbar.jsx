import React from "react";
import "../../styles/Admin.css";

export function AdminNavbar({
  activeTab,
  setActiveTab,
  user,
  logout,
  sidebarOpen,
}) {
  const handleTabClick = (tab, e) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      try {
        // Kiểm tra xem logout function có tồn tại không
        if (typeof logout === "function") {
          await logout();
          console.log("Đăng xuất thành công");
        } else {
          console.error("Logout function không được truyền vào component");
          // Fallback logout method
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);

        // Thử logout bằng cách khác nếu method chính thất bại
        try {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        } catch (fallbackError) {
          console.error("Lỗi fallback logout:", fallbackError);
          alert("Có lỗi khi đăng xuất. Vui lòng tải lại trang và thử lại.");
        }
      }
    }
  };

  return (
    <div className="admin-navbar">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <h2>Quản lý Cửa hàng - The Admin</h2>
        <nav>
          <ul>
            <li>
              <a
                href="#posts"
                className={activeTab === "posts" ? "active" : ""}
                onClick={(e) => handleTabClick("posts", e)}
              >
                📝 Bài viết
              </a>
            </li>
            <li>
              <a
                href="#products"
                className={activeTab === "products" ? "active" : ""}
                onClick={(e) => handleTabClick("products", e)}
              >
                🛍️ Products
              </a>
            </li>
            <li>
              <a
                href="#categories"
                className={activeTab === "categories" ? "active" : ""}
                onClick={(e) => handleTabClick("categories", e)}
              >
                🏷️ Categories
              </a>
            </li>
          </ul>
        </nav>

        {/* User info moved to sidebar bottom */}
        <div className="user-info">
          <span id="userEmail">{user?.email || "admin@example.com"}</span>
          <img
            id="userPhoto"
            src={user?.photoURL || "/default-avatar.png"}
            alt="User"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
