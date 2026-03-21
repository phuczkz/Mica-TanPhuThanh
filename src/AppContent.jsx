import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { ContactPage } from "./pages/ContactPage";
import { ProductDetail } from "./components/customer/ProductDetail";
import { listenToProducts } from "./services/productService";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import { MainLayout } from "./components/layout/MainLayout";
import { CartPage } from "./pages/CartPage";
import { StorePage } from "./pages/StorePage";
import { BlogPage } from "./pages/BlogPage";

function AppContent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToProducts(setProducts);
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout products={products} />}>
        <Route path="/" element={<HomePage products={products} />} />
        <Route path="/products/:id" element={<ProductDetail products={products} />} />
        <Route path="/products" element={<CategoryProductsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      {/* Admin Route */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Auth Route */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default AppContent;
