import { useState, useEffect, useCallback } from "react";
import { listenToProducts, deleteProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { Package, Search, Filter, Trash2, Edit2, ImageOff, RefreshCw, XCircle } from "lucide-react";

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
    const loadData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();

    const unsubscribe = listenToProducts((productsData) => {
      setAllProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        // Không gọi loadData() nữa vì snapshot sẽ tự update setAllProducts
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
    <div className="w-full">
      {/* KHU VỰC TÌM KIẾM VÀ LỌC */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Search className="text-slate-400" size={20} />
          <h3 className="text-lg font-bold text-slate-800 m-0">Tìm kiếm & Bộ lọc Sản phẩm</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="searchName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Từ khóa</label>
            <div className="relative">
              <input
                id="searchName"
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all outline-none"
                placeholder="Tên sản phẩm..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="categoryFilter" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-slate-300 transition-all outline-none"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="priceFilter" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khoảng giá</label>
            <select
              id="priceFilter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-slate-300 transition-all outline-none"
            >
              <option value="">Tất cả giá</option>
              <option value="0-100000">Dưới 100k</option>
              <option value="100000-500000">100k - 500k</option>
              <option value="500000-1000000">500k - 1tr</option>
              <option value="1000000-5000000">1tr - 5tr</option>
              <option value="5000000-999999999">Trên 5tr</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sortBy" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sắp xếp theo</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-slate-300 transition-all outline-none"
            >
              <option value="">Mặc định</option>
              <option value="name-asc">Tên (A-Z)</option>
              <option value="name-desc">Tên (Z-A)</option>
              <option value="price-asc">Giá (Thấp đến Cao)</option>
              <option value="price-desc">Giá (Cao xuống Thấp)</option>
              <option value="newest">Ngày tạo (Mới nhất)</option>
              <option value="oldest">Ngày tạo (Cũ nhất)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm font-medium text-slate-600">
            {filteredProducts.length === allProducts.length
              ? (<><span className="text-emerald-600 font-bold">{allProducts.length}</span> Sản phẩm trong kho</>)
              : (<><Filter size={14} className="inline mr-1 text-slate-400" /> Kết quả lọc: <span className="text-brand-orange font-bold text-base">{filteredProducts.length}</span> / {allProducts.length}</>)}
          </div>
          
          <button 
            onClick={clearSearch} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg transition-colors border border-slate-200"
          >
            <RefreshCw size={14} /> Tái lập bộ lọc
          </button>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM GRID VIEW DOANH NGHIỆP */}
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-brand-navy" size={24} />
        <h3 className="text-2xl font-bold text-slate-800 m-0">Kho Sản Phẩm</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const category = categories.find((cat) => cat.id === product.category);

          return (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col h-full group">
              {/* Product Image Box */}
              <div className="relative aspect-square sm:aspect-[4/3] bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 overflow-hidden">
                {product.imageBase64 ? (
                  <img
                    src={product.imageBase64}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                     <ImageOff size={32} className="mb-2 opacity-50" />
                     <span className="text-[11px] font-semibold uppercase tracking-wider">No Image</span>
                  </div>
                )}
                
                {/* Stock Badge Absolute */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                    product.inStock !== false 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                      : "bg-rose-50 text-rose-600 border-rose-200"
                  }`}>
                    {product.inStock !== false ? "● Còn Hàng" : "○ Hết Hàng"}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] uppercase font-bold tracking-wider rounded">
                    {category ? category.name : "Chưa phân loại"}
                  </span>
                </div>
                
                <h4 className="text-base font-bold text-slate-800 leading-snug mb-3 line-clamp-2 min-h-[44px]" title={product.name}>
                  {product.name}
                </h4>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-bold">
                     <span className="text-rose-600 text-lg">
                       {product.price?.toLocaleString("vi-VN")}
                     </span>
                     <span className="text-xs text-rose-600/70 ml-1 uppercase">VND</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1.5 border border-slate-200 rounded-lg p-1 bg-slate-50">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-slate-500 hover:text-brand-navy hover:bg-white rounded shadow-sm transition-all"
                      title="Chỉnh sửa chi tiết"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded shadow-sm transition-all"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && allProducts.length > 0 && (
        <div className="flex flex-col flex-1 items-center justify-center p-12 bg-white rounded-xl border border-slate-200 mt-4 text-slate-400">
          <XCircle size={40} className="mb-4 opacity-50" />
          <p className="text-sm font-medium">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
        </div>
      )}

      {allProducts.length === 0 && (
        <div className="flex flex-col flex-1 items-center justify-center p-12 bg-white rounded-xl border border-slate-200 mt-4 text-slate-400">
          <Package size={40} className="mb-4 opacity-50" />
          <p className="text-sm font-medium">Kho hàng hiện tại chưa có sản phẩm nào. Hãy bấm "Thêm Sản Phẩm Mới" để bắt đầu.</p>
        </div>
      )}
    </div>
  );
}
