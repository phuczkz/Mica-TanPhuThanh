import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { listenToProducts } from "../services/productService";
import { ArrowRight, Tag, ShieldCheck, Zap } from "lucide-react";

export function StorePage() {
  const [categories, setCategories] = useState([]);
  const [highlightProducts, setHighlightProducts] = useState([]);

  useEffect(() => {
    async function loadData() {
      const cats = await getCategories();
      setCategories(cats);
    }
    loadData();

    const unsubscribe = listenToProducts((prods) => {
      setHighlightProducts(prods.slice(0, 4));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Store Hero Promo */}
      <div className="bg-gradient-to-r from-brand-navy to-blue-800 py-16 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">SIÊU THỊ VẬT TƯ QUẢNG CÁO</h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-lg mb-8">
          Khám phá không gian mua sắm sỉ và lẻ quy mô nhất. Đầy đủ các chủng loại Alu, Mica, Formex, Decal... với giá tận xưởng.
        </p>
        <div className="flex justify-center gap-4 text-sm font-medium">
          <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm"><ShieldCheck size={16} className="mr-2 text-brand-orange"/> Chính hãng 100%</span>
          <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm"><Zap size={16} className="mr-2 text-brand-yellow"/> Sẵn hàng số lượng lớn</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="w-1.5 h-6 bg-brand-orange mr-3 rounded"></span> Danh Mục Cửa Hàng
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all aspect-video flex items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Tag size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-brand-orange transition-colors">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale / Highlights */}
        <section className="mb-16">
          <div className="bg-brand-navy rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative z-10">
              <div>
                <span className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-1 block">Best Sellers</span>
                <h2 className="text-3xl font-extrabold text-white">Sản Phẩm Bán Chạy Nhất</h2>
              </div>
              <Link to="/products" className="text-white hover:text-brand-orange mt-4 md:mt-0 flex items-center transition-colors">
                Xem tất cả <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {highlightProducts.map(product => (
                <Link key={product.id} to={`/products/${product.id}`} className="bg-white rounded-lg p-3 hover:transform hover:-translate-y-1 transition-transform group">
                  <div className="aspect-square bg-gray-50 rounded mb-3 overflow-hidden text-center">
                     {product.imageBase64 ? (
                        <img src={product.imageBase64} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                     )}
                  </div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-2 group-hover:text-brand-orange">{product.name}</h4>
                  <div className="text-brand-orange font-bold">{product.price ? `${product.price.toLocaleString("vi-VN")} đ` : 'Liên hệ'}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
