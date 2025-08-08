import { useLocation, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { ContactPage } from "./pages/ContactPage";
import { ProductDetail } from "./components/customer/ProductDetail";
import { Header } from "./components/common/Header";
import { getProducts } from "./services/productService";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import CategoryProductsPage from "./pages/CategoryProductsPage";

// ...existing imports...

function AppContent() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const hideHeader =
    location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <>
      {!hideHeader && <Header products={products} />}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route
            path="/products/:id"
            element={<ProductDetail products={products} />}
          />
          <Route path="/products" element={<CategoryProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Đảm bảo route admin được bao bọc bằng ProtectedRoute */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}
export default AppContent;
