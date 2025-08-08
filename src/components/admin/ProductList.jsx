import { useState, useEffect, useCallback } from "react";
import { getProducts, deleteProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

export function ProductList({ onEdit }) {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Sử dụng useCallback để tránh dependency warning
  const filterProducts = useCallback(() => {
    let filtered = [...allProducts];

    if (searchName.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchName.toLowerCase().trim())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (priceFilter) {
      const [minPrice, maxPrice] = priceFilter.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate
              ? a.createdAt.toDate()
              : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate
              ? b.createdAt.toDate()
              : new Date(b.createdAt || 0);
            return dateB - dateA;
          });
          break;
        case "oldest":
          filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate
              ? a.createdAt.toDate()
              : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate
              ? b.createdAt.toDate()
              : new Date(b.createdAt || 0);
            return dateA - dateB;
          });
          break;
        default:
          // Không làm gì nếu sortBy không khớp
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchName, categoryFilter, priceFilter, sortBy]);

  useEffect(() => {
    loadData();
  }, []);

  // Sửa dependency - thêm filterProducts vào dependency array
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setAllProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        loadData();
        alert("✅ Sản phẩm đã được xóa thành công!");
      } catch (error) {
        alert("❌ Lỗi khi xóa sản phẩm: " + error.message);
      }
    }
  };

  const clearSearch = () => {
    setSearchName("");
    setCategoryFilter("");
    setPriceFilter("");
    setSortBy("");
  };

  if (loading) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="product-list-container" style={{ with: "100%" }}>
      <div className="search-section">
        <h3>🔍 Tìm kiếm sản phẩm</h3>
        <div className="search-controls">
          <div className="form-group">
            <label htmlFor="searchName">Tên sản phẩm</label>
            <input
              id="searchName"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="form-control"
              placeholder="Nhập tên sản phẩm bạn muốn tìm..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryFilter">Danh mục</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priceFilter">Khoảng giá</label>
            <select
              id="priceFilter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả giá</option>
              <option value="0-100000">Dưới 100k</option>
              <option value="100000-500000">100k - 500k</option>
              <option value="500000-1000000">500k - 1M</option>
              <option value="1000000-5000000">1M - 5M</option>
              <option value="5000000-999999999">Trên 5M</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sortBy">Sắp xếp</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              <option value="">Mặc định</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button onClick={clearSearch} className="btn btn-secondary">
              🗑️ Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="search-results">
          {filteredProducts.length === allProducts.length
            ? `✨ Hiển thị tất cả ${allProducts.length} sản phẩm`
            : `🎯 Tìm thấy ${filteredProducts.length} / ${allProducts.length} sản phẩm`}
        </div>
      </div>

      <h3 style={{ marginBottom: "20px" }}>📦 Danh sách sản phẩm</h3>
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const category = categories.find(
            (cat) => cat.id === product.category
          );

          return (
            <div key={product.id} className="product-card">
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
                <div className="product-content">
                  {category && (
                    <div className="product-category">{category.name}</div>
                  )}
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">
                    {product.price?.toLocaleString("vi-VN")} VND
                  </div>
                  <div
                    className={`product-stock ${
                      product.inStock !== false ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.inStock !== false ? "✅ Còn hàng" : "❌ Hết hàng"}
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => onEdit(product)}
                    className="btn btn-warning btn-sm"
                  >
                    SỬA
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn btn-danger btn-sm"
                  >
                    XÓA
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && allProducts.length > 0 && (
        <div className="no-products">
          Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.
        </div>
      )}

      {allProducts.length === 0 && (
        <div className="no-products">Chưa có sản phẩm nào được thêm.</div>
      )}
    </div>
  );
}
