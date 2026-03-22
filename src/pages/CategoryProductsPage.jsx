import { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { listenToProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useCart } from "../contexts/CartContext";
import { ChevronRight, Filter, Search, ShoppingCart, ShoppingBag, X } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CategoryProductsPage() {
  const query = useQuery();
  const rawCategoryId = query.get("category");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(rawCategoryId || "all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Notification Modal
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    setSelectedCategory(rawCategoryId || "all");
  }, [rawCategoryId]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }
    loadCategories();

    const unsubscribe = listenToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchPrice = true;
      
      if (priceRange === "under-500k") matchPrice = p.price < 500000;
      else if (priceRange === "500k-1m") matchPrice = p.price >= 500000 && p.price <= 1000000;
      else if (priceRange === "over-1m") matchPrice = p.price > 1000000;

      return matchCategory && matchSearch && matchPrice;
    });
  }, [products, selectedCategory, searchQuery, priceRange]);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // prevent navigation since it's inside a Link
    
    // Check if product has variants (colors or sizes)
    const hasVariants = (product.colors && product.colors.length > 0) || 
                        (product.sizes && product.sizes.length > 0);
    
    if (hasVariants) {
      // If has variants, must go to detail page to select
      navigate(`/products/${product.id}`);
    } else {
      // If no variants, add to cart directly
      addToCart(product, 1);
      setAddedProduct(product);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-orange transition-colors">Trang chủ</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium">Tất cả sản phẩm</span>
        </div>

        {/* Header & Mobile Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
             SẢN PHẨM <span className="text-gray-400 text-lg font-normal ml-2">({filteredProducts.length})</span>
          </h1>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Filter size={16} className="mr-2" /> Lọc
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`fixed inset-0 z-40 bg-black/50 lg:bg-transparent lg:static lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl lg:shadow-none lg:w-64 lg:static h-full overflow-y-auto lg:h-auto lg:bg-transparent p-6 lg:p-0 transition-transform">
              
              <div className="flex justify-between items-center lg:hidden mb-6">
                <h2 className="text-xl font-bold">Bộ lọc</h2>
                <button onClick={() => setShowMobileFilters(false)}><X size={24} className="text-gray-500 hover:text-red-500" /></button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center"><Search size={16} className="mr-2"/> Tìm kiếm</h3>
                <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Tên sản phẩm..."
                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-brand-orange focus:border-brand-orange shadow-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-8 bg-white lg:bg-transparent lg:p-0 p-4 rounded-xl shadow-sm border lg:border-none border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Danh Mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <input type="radio" name="category" checked={selectedCategory === "all"} onChange={() => setSelectedCategory("all")} className="text-brand-orange focus:ring-brand-orange mr-3" />
                    <span className="text-gray-700 group-hover:text-brand-orange transition-colors">Tất cả sản phẩm</span>
                  </label>
                  {categories.map(c => (
                    <label key={c.id} className="flex items-center cursor-pointer group">
                      <input type="radio" name="category" checked={selectedCategory === c.id} onChange={() => setSelectedCategory(c.id)} className="text-brand-orange focus:ring-brand-orange mr-3" />
                      <span className="text-gray-700 group-hover:text-brand-orange transition-colors">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8 bg-white lg:bg-transparent lg:p-0 p-4 rounded-xl shadow-sm border lg:border-none border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Mức Giá</h3>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "Tất cả mức giá" },
                    { id: "under-500k", label: "Dưới 500.000đ" },
                    { id: "500k-1m", label: "500.000đ - 1 Triệu" },
                    { id: "over-1m", label: "Trên 1 Triệu" },
                  ].map(price => (
                    <label key={price.id} className="flex items-center cursor-pointer group">
                      <input type="radio" name="price" checked={priceRange === price.id} onChange={() => setPriceRange(price.id)} className="text-brand-orange focus:ring-brand-orange mr-3" />
                      <span className="text-gray-700 group-hover:text-brand-orange transition-colors">{price.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4"><Search size={32}/></div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                 <p className="text-gray-500 mb-6 max-w-sm">Không có sản phẩm nào phù hợp với bộ lọc của bạn. Thử bỏ chọn một số điều kiện tìm kiếm.</p>
                 <button onClick={() => { setSelectedCategory("all"); setPriceRange("all"); setSearchQuery(""); }} className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Xóa bộ lọc
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.id}`} 
                    className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden"
                  >
                    {/* Image Container with Overlay */}
                    <div className="aspect-square w-full relative overflow-hidden bg-slate-50 flex items-center justify-center p-3">
                      <img 
                        src={product.imageBase64 || product.image || "/logo.png"} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      
                      {/* Glassmorphism Stock Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        {product.inStock !== false ? (
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-white/70 backdrop-blur-md text-emerald-600 border border-white/50 rounded-full shadow-sm">
                            ● Còn hàng
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-white/70 backdrop-blur-md text-rose-500 border border-white/50 rounded-full shadow-sm">
                            ○ Hết hàng
                          </span>
                        )}
                      </div>

                      {/* Add to cart overlay button on desktop */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        title="Thêm vào giỏ hàng"
                        className="absolute bottom-3 right-3 bg-brand-orange text-white p-2.5 rounded-full shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600 hidden lg:flex items-center justify-center z-20"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>

                    {/* Product Body */}
                    <div className="p-4 flex flex-col flex-grow bg-white">
                      <div className="mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {categories.find(c => c.id === product.category)?.name || "Sản phẩm"}
                        </span>
                      </div>
                      
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 mb-2 leading-tight min-h-[32px] group-hover:text-brand-orange transition-colors">
                        {product.name}
                      </h4>
                      
                      <div className="mt-auto flex items-end justify-between gap-1">
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[10px] text-slate-400 font-medium">Giá báo tốt nhất</span>
                           <div className="text-brand-orange font-black text-base sm:text-lg">
                             {product.price ? `${product.price.toLocaleString("vi-VN")} đ` : 'Liên hệ'}
                           </div>
                        </div>

                        {/* Add to cart mobile */}
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="lg:hidden text-brand-orange bg-orange-50 hover:bg-orange-100 p-2 rounded-xl transition-colors"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Added to Cart Notification Modal */}
      {addedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setAddedProduct(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-brand-navy p-5 text-center relative">
              <button onClick={() => setAddedProduct(null)} className="absolute top-3 right-3 text-white/70 hover:text-white">
                <X size={20} />
              </button>
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-green-500 shadow-sm border-[3px] border-green-100">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold text-white">Đã thêm vào giỏ!</h3>
            </div>
            <div className="p-5 text-center">
              <p className="text-gray-600 mb-6 text-sm">
                 Sản phẩm <strong>{addedProduct.name}</strong> đã có trong giỏ hàng.
              </p>
              <div className="flex flex-col gap-3">
                 <button onClick={() => setAddedProduct(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-lg transition-colors text-sm">
                   Tiếp Tục Chọn Đồ
                 </button>
                 <Link to="/cart" className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow-md">
                   Vào Giỏ Hàng
                 </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
