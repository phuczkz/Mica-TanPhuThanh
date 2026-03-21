import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { useCart } from "../../contexts/CartContext";
import { ChevronRight, Minus, Plus, ShoppingCart, CreditCard, X, Maximize2, Play, Pause, Info, Phone, AlertCircle } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        const foundProduct = productsData.find((p) => p.id === id);
        if (!foundProduct) {
          setError("Không tìm thấy sản phẩm");
          return;
        }
        const foundCategory = categoriesData.find((c) => c.id === foundProduct.category);
        setProduct(foundProduct);
        setCategory(foundCategory);
        setSelectedColor(null);
        setSelectedSize(null);
      } catch (err) {
        setError("Có lỗi khi tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    let interval;
    if (isAutoPlay && product) {
      const allImages = [product.imageBase64, ...(product.additionalImages?.map(i => i.base64) || [])].filter(Boolean);
      if (allImages.length > 1) {
        interval = setInterval(() => {
          setSelectedImage(prev => prev >= allImages.length - 1 ? 0 : prev + 1);
        }, 3000);
      }
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, product]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setShowImageModal(false);
      setShowNotification(false);
    }
  }, []);

  useEffect(() => {
    if (showImageModal || showNotification) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showImageModal, showNotification, handleKeyDown]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <div className="text-red-500 mb-4"><Info size={48} /></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{error || "Không tìm thấy sản phẩm"}</h2>
        <button onClick={() => navigate("/")} className="bg-brand-navy hover:bg-brand-blue text-white px-6 py-2 rounded transition-colors">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const allImages = [product.imageBase64, ...(product.additionalImages?.map((img) => img.base64) || [])].filter(Boolean);

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-orange transition-colors">Trang chủ</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          {category && (
            <>
              <Link to={`/products?category=${category.id}`} className="hover:text-brand-orange transition-colors">{category.name}</Link>
              <ChevronRight size={14} className="mx-2 shrink-0" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col">
            <div className="relative aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-4 group">
              {allImages.length > 0 ? (
                <img 
                  src={allImages[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setShowImageModal(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Không có ảnh</div>
              )}
              
              {allImages.length > 0 && (
                <button 
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-700 hover:text-brand-orange hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Maximize2 size={20} />
                </button>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setSelectedImage(idx); setIsAutoPlay(false); }}
                    className={`shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${selectedImage === idx ? 'border-brand-orange' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                
                {/* Autoplay toggler */}
                <button 
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded text-gray-500 hover:text-brand-orange hover:bg-gray-100 transition-colors"
                >
                  {isAutoPlay ? <Pause size={24} className="mb-1"/> : <Play size={24} className="mb-1"/>}
                  <span className="text-xs">{isAutoPlay ? 'Dừng' : 'Tự động'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {category && (
               <span className="inline-block px-3 py-1 bg-brand-light text-brand-navy text-xs font-bold uppercase tracking-wider rounded mb-4 w-fit">
                 {category.name}
               </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl font-bold text-brand-orange">
                {product.price ? `${product.price.toLocaleString("vi-VN")} VND` : 'Liên hệ báo giá'}
              </span>
              <span className={`px-2.5 py-1 text-sm font-medium rounded ${product.inStock !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.inStock !== false ? "✅ Còn hàng" : "❌ Hết hàng"}
              </span>
            </div>

            {/* Specs */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-5 bg-brand-orange mr-2 rounded"></span> Thông số sản phẩm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {[
                  { label: "Mã SP", value: product.productCode },
                  { label: "Thương hiệu", value: product.brand },
                  { label: "Xuất xứ", value: product.origin },
                  { label: "Chất liệu", value: product.material },
                  { label: "Bảo hành", value: product.warranty },
                ].map((spec, idx) => spec.value && (
                  <div key={idx} className="flex border-b border-dashed border-gray-200 pb-2">
                    <span className="text-gray-500 w-24 shrink-0">{spec.label}:</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants Selection */}
            {((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) && (
              <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-5 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-gray-900">Màu sắc:</span>
                       <span className="text-sm font-medium text-brand-orange">{selectedColor ? selectedColor.name : "Vui lòng chọn"}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                        <button 
                          key={color.id} 
                          onClick={() => setSelectedColor(color)}
                          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${selectedColor?.id === color.id ? 'border-brand-orange bg-orange-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <span className={`w-5 h-5 rounded-full border shadow-sm ${selectedColor?.id === color.id ? 'border-brand-orange scale-110' : 'border-gray-300'}`} style={{backgroundColor: color.hex}}></span>
                          <span className={`text-sm font-medium ${selectedColor?.id === color.id ? 'text-brand-orange' : 'text-gray-700'}`}>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-0">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-gray-900">Kích thước / Độ dày:</span>
                       <span className="text-sm font-medium text-brand-orange">{selectedSize ? selectedSize : "Vui lòng chọn"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button 
                          key={size} 
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${selectedSize === size ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {product.inStock !== false && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-auto">
                <div className="flex items-center mb-6">
                  <span className="text-gray-700 font-medium mr-4">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors" disabled={quantity <= 1}>
                      <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-gray-600"}/>
                    </button>
                    <span className="w-12 text-center font-medium border-x border-gray-300 py-2">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                      <Plus size={16} className="text-gray-600"/>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => { 
                      if (product.colors?.length > 0 && !selectedColor) return alert("Vui lòng chọn màu sắc sản phẩm!");
                      if (product.sizes?.length > 0 && !selectedSize) return alert("Vui lòng chọn kích thước/độ dày!");
                      addToCart({ ...product, selectedColor, selectedSize }, quantity); 
                      setShowNotification(true); 
                    }} 
                    className="flex-1 flex items-center justify-center bg-brand-navy hover:bg-brand-blue text-white font-bold py-3 px-6 rounded transition-colors shadow-sm"
                  >
                    <ShoppingCart size={20} className="mr-2" /> Thêm Vào Giỏ
                  </button>
                  <button 
                    onClick={() => { 
                      if (product.colors?.length > 0 && !selectedColor) return alert("Vui lòng chọn màu sắc sản phẩm!");
                      if (product.sizes?.length > 0 && !selectedSize) return alert("Vui lòng chọn kích thước/độ dày!");
                      addToCart({ ...product, selectedColor, selectedSize }, quantity); 
                      navigate("/cart"); 
                    }} 
                    className="flex-1 flex items-center justify-center bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-colors shadow-sm"
                  >
                    <CreditCard size={20} className="mr-2" /> Mua Ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-4">
              📝 Chi tiết sản phẩm
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      {showImageModal && allImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <X size={32} />
          </button>
          
          <img src={allImages[selectedImage]} alt={product.name} className="max-w-full max-h-[90vh] object-contain" />
          
          {allImages.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev > 0 ? prev - 1 : allImages.length - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/50 p-3 rounded-full"
              >
                <ChevronRight size={36} className="rotate-180" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev < allImages.length - 1 ? prev + 1 : 0); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/50 p-3 rounded-full"
              >
                <ChevronRight size={36} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 bg-black/50 px-4 py-1.5 rounded-full text-sm tracking-widest font-mono">
                {selectedImage + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Notification Modal */}
      {showNotification && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowNotification(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-brand-navy p-6 text-center relative">
              <button onClick={() => setShowNotification(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 shadow-sm border-[3px] border-green-100">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Thêm vào giỏ thành công!</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Đã thêm <strong>{quantity} {product.name}</strong> vào giỏ hàng.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowNotification(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded transition-colors text-center text-sm">
                  Tiếp Tục Chọn Đồ
                </button>
                <Link to="/cart" className="flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors text-center text-sm shadow-md">
                  Tới Giỏ Hàng Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
