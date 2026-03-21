import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CategoryManager } from "../components/admin/CategoryManager";
import { ProductForm } from "../components/admin/ProductForm";
import { ProductList } from "../components/admin/ProductList";
import { PostManager } from "../components/admin/PostManager";
import { OrderList } from "../components/admin/OrderList";
import AdminNavbar from "../components/admin/AdminNavbar";
import "../styles/Admin.css";

export function AdminPage() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [productToEdit, setProductToEdit] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        {activeTab === "posts" && <PostManager />}

        {activeTab === "products" && (
          <>
            <div className="page-header flex justify-between items-center mb-6">
              <h1 className="page-title mb-0">📦 Quản lý sản phẩm</h1>
              {!productToEdit && (
                 <button 
                    onClick={() => setProductToEdit({ isNew: true })} 
                    className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow transition-colors"
                 >
                    ➕ Thêm Sản Phẩm Mới
                 </button>
              )}
            </div>
            
            {productToEdit ? (
              <div className="product-form-container relative">
                <div className="flex justify-between items-center bg-gray-50 p-4 border rounded-t-lg mb-0 border-b-0">
                  <span className="font-semibold text-gray-700">
                    {productToEdit.isNew ? "✨ Đang tạo sản phẩm mới" : `✏️ Đang chỉnh sửa: ${productToEdit.name}`}
                  </span>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-1.5 px-3 rounded text-sm transition-colors"
                  >
                    Hủy & Quay lại danh sách
                  </button>
                </div>
                {/* Wrap form inside a container and pass actual null if isNew to avoiding bug */}
                <ProductForm
                  productToEdit={productToEdit.isNew ? null : productToEdit}
                  onSave={handleSaveProduct}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              // Bỏ key refreshProducts vì snapshot đã lo real-time List, component sẽ tự re-render
              <ProductList onEdit={handleEditProduct} />
            )}
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

        {activeTab === "orders" && <OrderList />}
      </div>
    </div>
  );
}
