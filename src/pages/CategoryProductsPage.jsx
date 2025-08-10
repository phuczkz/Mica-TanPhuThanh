import { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { Footer } from "../components/common/Footer";
import "../styles/Customer.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CategoryProductsPage() {
  const query = useQuery();
  const categoryId = query.get("category");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === categoryId),
    [products, categoryId]
  );

  if (!categoryId) {
    return (
      <>
        <div className="category-products-page">
          <div className="error-container">
            <div className="error-message">
              <h2>❌ Thiếu thông tin danh mục</h2>
              <button onClick={() => navigate("/")} className="btn-back">
                ← Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="category-products-page">
          <div className="loading-container">
            <div className="loading">Đang tải sản phẩm...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="category-products-page">
          <div className="error-container">
            <div className="error-message">
              <h2>❌ {error}</h2>
              <button onClick={() => navigate("/")} className="btn-back">
                ← Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="category-products-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator"> › </span>
          <span className="breadcrumb-current">
            {category?.name || "Sản phẩm"}
          </span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="category-header">
            <span className="category-icon">🏷️</span>
            <h1 className="category-title">{category?.name || "Sản phẩm"}</h1>
            <span className="product-count">
              ({filteredProducts.length} sản phẩm)
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-message">
              <h3>📦 Chưa có sản phẩm nào trong danh mục này</h3>
              <p>Hãy quay lại sau để xem thêm sản phẩm mới nhé!</p>
              <Link to="/" className="btn btn-primary">
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="products-grid-full">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card-link"
              >
                <div className="product-card">
                  {product.imageBase64 ? (
                    <img
                      src={product.imageBase64}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">Không có ảnh</div>
                  )}
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">
                      {product.price?.toLocaleString("vi-VN")} VND
                    </div>
                    <div className="product-stock">
                      {product.inStock !== false ? (
                        <span className="in-stock">✅ Còn hàng</span>
                      ) : (
                        <span className="out-stock">❌ Hết hàng</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to Home Button */}
        <div className="back-section">
          <Link to="/" className="btn btn-secondary">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
