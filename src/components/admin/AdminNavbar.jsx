import React, { useState, useEffect } from "react";
import { listenToOrders, markAllOrdersAsViewed } from "../../services/orderService";
import { ChevronLeft, ChevronRight, FileText, Package, Tags, ShoppingBag, LogOut } from "lucide-react";
import "../../styles/Admin.css";

export function AdminNavbar({
  activeTab,
  setActiveTab,
  user,
  logout,
  sidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const unreadCount = orders.filter((o) => o.status === "pending").length;

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
      {/* Sidebar background */}
      <div className={`sidebar ${sidebarOpen ? "active" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        
        {/* Header containing Title & Toggle Btn */}
        <div className={`flex items-center p-4 py-6 border-b border-white/10 mb-2 ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
          {!sidebarCollapsed && <h2 className="text-lg font-bold text-white mb-0 sidebar-title whitespace-nowrap">Quản Trị Viên</h2>}
          <button 
            className="text-slate-400 hover:text-white transition-colors hidden lg:flex p-1 rounded-md hover:bg-white/10"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Thu gọn/Mở rộng menu"
          >
            {sidebarCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>
        </div>

        <nav>
          <ul>
            <li>
              <a
                href="#posts"
                className={`group ${activeTab === "posts" ? "active" : ""}`}
                onClick={(e) => handleTabClick("posts", e)}
              >
                <FileText size={20} className="shrink-0 group-hover:text-brand-orange transition-colors" />
                <span className="menu-text ml-3">Bài viết</span>
              </a>
            </li>
            <li>
              <a
                href="#products"
                className={`group ${activeTab === "products" ? "active" : ""}`}
                onClick={(e) => handleTabClick("products", e)}
              >
                <Package size={20} className="shrink-0 group-hover:text-brand-orange transition-colors" />
                <span className="menu-text ml-3">Sản phẩm</span>
              </a>
            </li>
            <li>
              <a
                href="#categories"
                className={`group ${activeTab === "categories" ? "active" : ""}`}
                onClick={(e) => handleTabClick("categories", e)}
              >
                <Tags size={20} className="shrink-0 group-hover:text-brand-orange transition-colors" />
                <span className="menu-text ml-3">Danh mục</span>
              </a>
            </li>
            <li>
              <a
                href="#orders"
                className={`group ${activeTab === "orders" ? "active" : ""}`}
                onClick={(e) => handleTabClick("orders", e)}
              >
                <ShoppingBag size={20} className="shrink-0 group-hover:text-brand-orange transition-colors" />
                <span className="menu-text ml-3 flex-1 text-left">Đơn Báo Giá</span>
                {unreadCount > 0 && (
                  <span className={`bg-red-500 text-white font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse shrink-0 ${sidebarCollapsed ? "absolute top-2 right-2 text-[8px]" : "ml-2 text-[11px]"}`}>
                    {unreadCount}
                  </span>
                )}
              </a>
            </li>
          </ul>
        </nav>

        {/* User info moved to sidebar bottom */}
        <div className="user-info">
          <img
            id="userPhoto"
            src={user?.photoURL || "/default-avatar.png"}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-white/20 mb-3"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className="user-info-text text-center w-full">
             <span id="userEmail" className="block text-xs text-slate-400 font-medium mb-1 truncate px-2">{user?.email || "admin@example.com"}</span>
          </div>
          
          <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
            <LogOut size={18} />
            <span className="menu-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
