import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import { ChevronRight } from "lucide-react";

export function CategorySection({ products }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const productsByCategory = {};
  products.forEach((product) => {
    const categoryId = product.category || "other";
    if (!productsByCategory[categoryId]) productsByCategory[categoryId] = [];
    productsByCategory[categoryId].push(product);
  });

  return (
    <div className="space-y-16">
      {categories.map((category) => {
        const categoryProducts = productsByCategory[category.id] || [];
        if (categoryProducts.length === 0) return null;

        // Display up to 8 products per category on home page
        const topProducts = categoryProducts.slice(0, 8);

        return (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center">
                <span className="w-2 h-6 bg-brand-orange rounded mr-3"></span>
                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{category.name}</h3>
                <span className="ml-3 text-sm text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
                  {categoryProducts.length}
                </span>
              </div>
              <Link to={`/products?category=${category.id}`} className="hidden sm:flex items-center text-sm font-semibold text-brand-orange hover:text-orange-600 transition-colors">
                Xem tất cả <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="p-4 sm:p-6 bg-white relative">
              <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Ẩn scrollbar cho Chrome/Safari */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .scrollbar-hide::-webkit-scrollbar { display: none; }
                `}} />
                
                {topProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.id}`} 
                    className="group relative flex flex-col flex-shrink-0 w-[180px] sm:w-[240px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden snap-start"
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
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-md text-emerald-600 border border-white/50 rounded-full shadow-sm">
                            ● Còn hàng
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-md text-rose-500 border border-white/50 rounded-full shadow-sm">
                            ○ Hết hàng
                          </span>
                        )}
                      </div>

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-brand-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <div className="bg-white p-2.5 rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                           <ChevronRight size={18} className="text-brand-orange" />
                         </div>
                      </div>
                    </div>

                    {/* Product Body */}
                    <div className="p-4 flex flex-col flex-grow bg-white">
                      <div className="mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {category.name}
                        </span>
                      </div>
                      
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 mb-2 leading-tight min-h-[32px] group-hover:text-brand-orange transition-colors">
                        {product.name}
                      </h4>
                      
                      <div className="mt-auto flex flex-col gap-0.5">
                         <span className="text-[10px] text-slate-400 font-medium">Giá báo tốt nhất</span>
                         <div className="text-brand-orange font-black text-base sm:text-lg">
                           {product.price ? `${product.price.toLocaleString("vi-VN")} đ` : 'Liên hệ'}
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* "View All" Card at the end of scroll */}
                <Link 
                  to={`/products?category=${category.id}`}
                  className="flex-shrink-0 w-[140px] sm:w-[180px] flex flex-col items-center justify-center group bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-orange hover:bg-orange-50 transition-all duration-300 snap-start"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2.5 shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </div>
                  <span className="font-bold text-xs text-slate-600 group-hover:text-brand-orange transition-colors text-center px-4">Xem tất cả {category.name}</span>
                </Link>
              </div>
              
              {/* Desktop Scroll Hints (Gradients) */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden sm:block"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
