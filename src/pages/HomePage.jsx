import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listenToProducts } from "../services/productService";
import { CategorySection } from "../components/customer/CategorySection";
import { Truck, ShieldCheck, Scissors, ThumbsUp } from "lucide-react";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToProducts(productsData => {
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-50 mix-blend-multiply"></div>
        {/* We can use a pattern or image here in the future */}
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            TỔNG KHO VẬT TƯ QUẢNG CÁO <br className="hidden md:block" /> <span className="text-brand-yellow">TẤN PHÚ THÀNH</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
            Chuyên cung cấp sĩ & lẻ Tấm ALU, MICA, Formex, Decal... Chất lượng hàng đầu, giá cả tại xưởng, giao hàng nhanh chóng nội thành và toàn quốc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded shadow-lg transition-colors text-lg">
              Xem Sản Phẩm
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-brand-navy text-white font-bold py-3 px-8 rounded transition-colors text-lg">
              Liên Hệ Báo Giá
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Horizontal Static on Desktop, Auto-scroll on Mobile/Tablet */}
      <section className="bg-white py-12 border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 25s linear infinite;
            }
            @media (min-width: 1024px) {
              .animate-marquee {
                animation: none;
                display: block;
                width: 100%;
                transform: none !important;
              }
            }
            .feature-set {
              display: flex;
              flex-shrink: 0;
            }
            @media (min-width: 1024px) {
              .feature-set {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                width: 100%;
              }
              .feature-set:nth-child(n+2) {
                display: none;
              }
            }
            .feature-item {
              flex-shrink: 0;
              width: 280px;
              margin-right: 2rem;
            }
            @media (min-width: 1024px) {
              .feature-item {
                width: 100%;
                margin-right: 0;
              }
            }
          `}} />

          <div className="relative">
            <div className="animate-marquee">
              {/* Render features twice for seamless loop, hide second set on desktop */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`feature-set ${i > 0 ? 'lg:hidden' : ''}`}>
                  {[
                    { icon: Truck, title: "Giao Hàng Nhanh", desc: "Hỗ trợ vận chuyển tận nơi nội thành TP.HCM" },
                    { icon: ShieldCheck, title: "Hàng Chính Hãng", desc: "Sản phẩm chất lượng cao từ các nhà máy uy tín" },
                    { icon: Scissors, title: "Cắt Theo Yêu Cầu", desc: "Hỗ trợ cắt ALU, MICA theo kích thước chuẩn xác" },
                    { icon: ThumbsUp, title: "Giá Cả Cạnh Tranh", desc: "Chiết khấu cao cho đơn hàng số lượng lớn" },
                  ].map((feature, idx) => (
                    <div key={`${i}-${idx}`} className="feature-item flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <feature.icon size={32} className="text-brand-orange" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1 tracking-tight">{feature.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Fading Edges for Scroll Effect on smaller screens */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 lg:hidden"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 lg:hidden"></div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brand-navy relative inline-block">
              SẢN PHẨM NỔI BẬT
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-brand-orange rounded"></span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-orange border-t-transparent"></div>
            </div>
          ) : products.length > 0 ? (
            <CategorySection products={products} />
          ) : (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-sm border">
              Chưa có sản phẩm nào.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
