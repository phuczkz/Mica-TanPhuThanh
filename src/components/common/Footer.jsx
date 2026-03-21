import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, ChevronUp } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              MICA <span className="text-brand-yellow">TÂN PHÚ THÀNH</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Đơn vị phân phối hàng đầu các vật tư quảng cáo, tấm ALU, MICA, Formex, Decal... tại Việt Nam. Uy tín, chất lượng và giá cả cạnh tranh.
            </p>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <MapPin size={18} className="mr-3 text-brand-yellow shrink-0 mt-0.5" />
                <span>705 Đường Cách Mạng Tháng Tám, Chánh Nghĩa, Thủ Dầu Một, Bình Dương</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-3 text-brand-yellow shrink-0" />
                <span>+84 989 305 754</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-3 text-brand-yellow shrink-0" />
                <span>Tanphuthanh@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <span className="w-8 h-1 bg-brand-orange mr-3 rounded"></span> Liên Kết Nhanh
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Trang chủ', 'Sản phẩm', 'Danh mục vật tư', 'Về chúng tôi', 'Liên hệ báo giá'].map((item, idx) => (
                <li key={idx}>
                  <Link to="/" className="hover:text-brand-yellow transition-colors flex items-center">
                    <span className="text-brand-orange mr-2">›</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <span className="w-8 h-1 bg-brand-orange mr-3 rounded"></span> Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Chính sách bảo hành', 'Chính sách đổi trả', 'Chính sách vận chuyển', 'Câu hỏi thường gặp', 'Bảng giá vật tư Cắt Laser'].map((item, idx) => (
                <li key={idx}>
                  <Link to="/" className="hover:text-brand-yellow transition-colors flex items-center">
                    <span className="text-brand-orange mr-2">›</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <span className="w-8 h-1 bg-brand-orange mr-3 rounded"></span> Đăng Ký Tư Vấn
            </h4>
            <p className="text-sm text-gray-400 mb-4">Để lại email để nhận báo giá vật tư mới nhất.</p>
            <form className="flex mb-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn..."
                className="bg-brand-blue border border-transparent text-white px-4 py-2 w-full focus:outline-none focus:border-brand-yellow rounded-l text-sm"
              />
              <button
                type="submit"
                className="bg-brand-orange hover:bg-orange-600 px-4 py-2 rounded-r transition-colors text-sm font-medium"
              >
                Gửi
              </button>
            </form>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-brand-blue pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} Bán Vật Tư Quảng Cáo. Bản quyền thuộc về Mica Tân Phú Thành.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 bg-brand-blue hover:bg-brand-orange text-white rounded flex items-center justify-center transition-colors"
              aria-label="Back to top"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
