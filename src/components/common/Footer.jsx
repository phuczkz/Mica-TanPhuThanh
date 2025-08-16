import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Import các icon cần thiết
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaHome,
  FaShoppingBag,
  FaThList,
  FaInfoCircle,
  FaHeadset,
  FaShippingFast,
  FaShieldAlt,
  FaQuestionCircle,
  FaChevronUp,
} from "react-icons/fa";
import "../../styles/Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openAccordion, setOpenAccordion] = useState(null); // Chỉ một accordion được mở tại một thời điểm

  // Theo dõi sự thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hàm xử lý việc đóng/mở accordion
  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null); // Đóng lại nếu đang mở
    } else {
      setOpenAccordion(index); // Mở accordion mới
    }
  };

  const AccordionSection = ({ title, index, children }) => {
    const isOpen = openAccordion === index;
    return (
      <div className="footer-section">
        <h4
          className="footer-title accordion-toggle"
          onClick={() => isMobile && toggleAccordion(index)}
        >
          {title}
          {isMobile && (
            <span className={`accordion-icon ${isOpen ? "open" : ""}`}></span>
          )}
        </h4>
        <div className={`accordion-content ${isOpen ? "open" : ""}`}>
          {children}
        </div>
      </div>
    );
  };

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
                <FaMapMarkerAlt className="icon" />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </div>
              <div className="contact-item">
                <FaPhoneAlt className="icon" />
                <span>+84 123 456 789</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="icon" />
                <span>Tanphuthanh@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <AccordionSection title="Liên kết nhanh" index={1}>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <FaHome /> Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products">
                  <FaShoppingBag /> Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/categories">
                  <FaThList /> Danh mục
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <FaInfoCircle /> Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <FaHeadset /> Liên hệ
                </Link>
              </li>
            </ul>
          </AccordionSection>

          {/* Customer Support */}
          <AccordionSection title="Hỗ trợ khách hàng" index={2}>
            <ul className="footer-links">
              <li>
                <Link to="/help">
                  <FaQuestionCircle /> Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/shipping">
                  <FaShippingFast /> Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/warranty">
                  <FaShieldAlt /> Bảo hành
                </Link>
              </li>
              <li>
                <Link to="/faq">
                  <FaHeadset /> Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </AccordionSection>

          {/* Social & Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Kết nối và nhận tin</h4>
            <div className="social-links">
              <a
                href="https://facebook.com"
                className="social-link facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook /> Facebook
              </a>
              {/* Thêm các mạng xã hội khác nếu cần */}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
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
        <FaChevronUp />
      </button>
    </footer>
  );
}
