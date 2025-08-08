import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Main Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <h3>🏪 Mica Tấn Phú Thành Store</h3>
              <p className="footer-tagline">
                Nơi mua sắm trực tuyến tin cậy với sản phẩm chất lượng cao
              </p>
            </div>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="icon">📍</span>
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </div>
              <div className="contact-item">
                <span className="icon">📞</span>
                <span>+84 123 456 789</span>
              </div>
              <div className="contact-item">
                <span className="icon">📧</span>
                <span>Tanphuthanh@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Liên kết nhanh</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">🏠 Trang chủ</Link>
              </li>
              <li>
                <Link to="/products">🛍️ Sản phẩm</Link>
              </li>
              <li>
                <Link to="/categories">📂 Danh mục</Link>
              </li>
              <li>
                <Link to="/about">ℹ️ Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/contact">📞 Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="footer-section">
            <h4 className="footer-title">Hỗ trợ khách hàng</h4>
            <ul className="footer-links">
              <li>
                <Link to="/help">❓ Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link to="/shipping">🚚 Chính sách giao hàng</Link>
              </li>
              <li>
                <Link to="/warranty">🛡️ Bảo hành</Link>
              </li>
              <li>
                <Link to="/faq">💬 Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Kết nối với chúng tôi</h4>
            <div className="social-links">
              <a
                href="https://facebook.com"
                className="social-link facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>📘</span> Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div
              className="footer-copyright"
              style={{
                color: "#666",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <p>&copy; {currentYear} Mica Store. Tất cả quyền được bảo lưu.</p>
              <p className="footer-dev">
                Phát triển bởi <span className="dev-name">Tấn Phú Thành</span>{" "}
                ❤️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Lên đầu trang"
      >
        ⬆️
      </button>
    </footer>
  );
}
