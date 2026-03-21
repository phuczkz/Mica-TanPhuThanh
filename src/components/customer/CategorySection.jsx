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

            {/* Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {topProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="group flex flex-col h-full bg-white rounded-lg border border-gray-100 hover:border-brand-orange hover:shadow-md transition-all duration-300">
                    <div className="aspect-square w-full relative overflow-hidden bg-gray-50 rounded-t-lg">
                      <img 
                        src={product.imageBase64 || product.image || "/logo.png"} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-brand-navy">
                        {product.name}
                      </h4>
                      <div className="mt-auto">
                        <div className="text-brand-orange font-bold text-base sm:text-lg mb-2">
                          {product.price ? `${product.price.toLocaleString("vi-VN")} đ` : 'Liên hệ báo giá'}
                        </div>
                        <div className="text-xs font-medium">
                          {product.inStock !== false ? (
                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Còn hàng</span>
                          ) : (
                            <span className="text-red-500 bg-red-50 px-2 py-1 rounded">Hết hàng</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Mobile view all link */}
              <div className="mt-6 text-center sm:hidden">
                <Link to={`/products?category=${category.id}`} className="inline-flex items-center justify-center w-full py-2.5 border border-brand-orange text-brand-orange rounded font-medium hover:bg-brand-orange hover:text-white transition-colors">
                  Xem tất cả ({categoryProducts.length})
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
