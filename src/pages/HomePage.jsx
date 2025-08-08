import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { CategorySection } from "../components/customer/CategorySection";
// import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import "../styles/Customer.css";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="customer-layout">
        <div className="loading">Đang tải sản phẩm...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-layout">
        <div className="error-message">
          <p>Có lỗi khi tải sản phẩm: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="customer-layout">
      <div className="products-container">
        {products.length > 0 ? (
          <CategorySection products={products} />
        ) : (
          <div className="no-products">
            Chưa có sản phẩm nào được thêm vào cửa hàng.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
