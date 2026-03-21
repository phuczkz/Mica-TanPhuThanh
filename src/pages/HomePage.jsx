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
            TỔNG KHO VẬT TƯ QUẢNG CÁO <br className="hidden md:block"/> <span className="text-brand-yellow">TÂN PHÚ THÀNH</span>
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

      {/* Features */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Giao Hàng Nhanh", desc: "Hỗ trợ vận chuyển tận nơi nội thành TP.HCM" },
              { icon: ShieldCheck, title: "Hàng Chính Hãng", desc: "Sản phẩm chất lượng cao từ các nhà máy uy tín" },
              { icon: Scissors, title: "Cắt Theo Yêu Cầu", desc: "Hỗ trợ cắt ALU, MICA theo kích thước chuẩn xác" },
              { icon: ThumbsUp, title: "Giá Cả Cạnh Tranh", desc: "Chiết khấu cao cho đơn hàng số lượng lớn" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                <feature.icon size={48} className="text-brand-orange mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
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
