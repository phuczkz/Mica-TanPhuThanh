import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CategoryManager } from "../components/admin/CategoryManager";
import { ProductForm } from "../components/admin/ProductForm";
import { ProductList } from "../components/admin/ProductList";
import { PostManager } from "../components/admin/PostManager";
import AdminNavbar from "../components/admin/AdminNavbar";
import "../styles/Admin.css";

export function AdminPage() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [productToEdit, setProductToEdit] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(0);

  // Close sidebar when clicking outside or changing tabs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".mobile-menu-btn")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen]);

  if (!currentUser) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setActiveTab("products");
    setSidebarOpen(false); // Close sidebar when editing

    setTimeout(() => {
      const formElement = document.querySelector(".form-card");
      if (formElement) {
        formElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleSaveProduct = () => {
    setProductToEdit(null);
    // Trigger refresh của ProductList
    setRefreshProducts((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setProductToEdit(null);
  };

  const handleTabChange = (newTab) => {
    if (newTab !== "products") {
      setProductToEdit(null);
    }
    setActiveTab(newTab);
    setSidebarOpen(false); // Close sidebar when changing tabs
  };

  return (
    <div className="admin-layout">
      {/* Mobile Menu Button */}
      <button
        className={`mobile-menu-btn ${sidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <AdminNavbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        user={currentUser}
        logout={logout}
        sidebarOpen={sidebarOpen}
      />

      <div className="main-content">
        {activeTab === "posts" && <PostManager />}

        {activeTab === "products" && (
          <>
            <div className="page-header">
              <h1 className="page-title">📦 Quản lý sản phẩm</h1>
              {productToEdit && (
                <div className="edit-mode-banner">
                  <span>
                    ✏️ Đang chỉnh sửa: <strong>{productToEdit.name}</strong>
                  </span>
                  <button
                    onClick={handleCancelEdit}
                    className="btn btn-secondary btn-sm"
                  >
                    Hủy chỉnh sửa
                  </button>
                </div>
              )}
            </div>
            <ProductForm
              productToEdit={productToEdit}
              onSave={handleSaveProduct}
              onCancel={handleCancelEdit}
            />
            <ProductList onEdit={handleEditProduct} key={refreshProducts} />
          </>
        )}

        {activeTab === "categories" && (
          <>
            <div className="page-header">
              <h1 className="page-title">🏷️ Quản lý danh mục</h1>
            </div>
            <CategoryManager />
          </>
        )}
      </div>
    </div>
  );
}
