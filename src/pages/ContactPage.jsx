import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaPaperPlane,
  FaSpinner,
  FaChevronDown,
} from "react-icons/fa";
import { } from "react-icons/si";
import "../styles/Contact.css";

const faqData = [
  {
    question: "🚚 Chính sách giao hàng như thế nào?",
    answer:
      "Chúng tôi giao hàng miễn phí trong nội thành TP.HCM cho đơn hàng từ 10,000,000 VNĐ. Thời gian giao hàng từ 1-3 ngày làm việc.",
  },
  {
    question: "💳 Tôi có thể thanh toán bằng cách nào?",
    answer:
      "Chúng tôi chấp nhận thanh toán bằng tiền mặt khi nhận hàng, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thẻ tín dụng.",
  },
  {
    question: "🔄 Chính sách đổi trả như thế nào?",
    answer:
      "Bạn có thể đổi trả sản phẩm trong vòng 1 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên vẹn và chưa sử dụng.",
  },
  {
    question: "🛡️ Sản phẩm có được bảo hành không?",
    answer:
      "Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản xuất. Thời gian bảo hành từ 6 tháng đến 2 năm tùy loại sản phẩm.",
  },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Hiển thị modal thông báo ngay lập tức
    setTimeout(() => {
      setSubmitStatus({
        type: "info",
        message: "Hệ thống đang phát triển. Để được hỗ trợ chi tiết vui lòng liên hệ qua SĐT hoặc đến trực tiếp cửa hàng.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const closeModal = () => {
    setSubmitStatus(null);
  };

  return (
    <div className="customer-layout">
      <div className="contact-page-modern">
        {/* Modern Hero Section */}
        <section className="contact-hero">
          <div className="container-custom">
            <div className="hero-content">
              <span className="hero-badge">Liên hệ với chúng tôi</span>
              <h1>Kết nối với <span className="text-gradient">Tân Phú Thành</span></h1>
              <p>
                Chúng tôi luôn sẵn sàng lắng nghe ý kiến và hỗ trợ giải đáp mọi thắc mắc của bạn về sản phẩm và dịch vụ quảng cáo.
              </p>
            </div>
          </div>
          <div className="hero-bg-accent"></div>
        </section>

        <div className="container-custom">
          {/* Information Cards Row */}
          <div className="contact-info-cards">
            <div className="info-card">
              <div className="card-icon-wrapper">
                <FaMapMarkerAlt size={24} />
              </div>
              <h3>Văn phòng</h3>
              <p>705 Đường Cách Mạng Tháng Tám, Chánh Nghĩa, Thủ Dầu Một, Bình Dương</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="card-link">Xem bản đồ</a>
            </div>

            <div className="info-card">
              <div className="card-icon-wrapper">
                <FaPhoneAlt size={24} />
              </div>
              <h3>Hotline Hỗ Trợ</h3>
              <p className="phone-number">0901 436 234</p>
              <p className="work-time text-xs text-gray-400 mt-1">Hỗ trợ 24/7 qua Zalo</p>
              <a href="tel:0901436234" className="card-link">Gọi ngay</a>
            </div>

            <div className="info-card">
              <div className="card-icon-wrapper">
                <FaEnvelope size={24} />
              </div>
              <h3>Email Doanh Nghiệp</h3>
              <p>tanphuthanh@gmail.com</p>
              <p className="work-time text-xs text-gray-400 mt-1">Phản hồi trong 24h</p>
              <a href="mailto:tanphuthanh@gmail.com" className="card-link">Gửi email</a>
            </div>
          </div>

          {/* Interactive Map Section - Moved Up */}
          <div className="contact-map-full">
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.4045238645477!2d106.65748!3d10.9720828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d13142fc8599%3A0xb0bf871fa00beca8!2s705%20%C4%90.%20C%C3%A1ch%20M%E1%BA%A1ng%20Th%C3%A1ng%20T%C3%A1m%2C%20Ch%C3%A1nh%20Ngh%C4%A9a%2C%20Th%E1%BB%A7%20D%E1%BA%A7u%20M%E1%BB%99t%2C%20B%C3%ACnh%20D%C6%B0%C6%A1ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1723156789123!5m2!1svi!2s"
                width="100%"
                title="Bản đồ Tân Phú Thành"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="contact-main-layout">
            {/* Left: Modern Contact Form */}
            <div className="contact-form-container">
              <div className="section-header">
                <h2>Gửi yêu cầu hỗ trợ</h2>
                <p>Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
              </div>

              {/* Modal thông báo */}
              {submitStatus && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Thông báo</h3>
                      <button className="modal-close" onClick={closeModal}>×</button>
                    </div>
                    <div className="modal-body">
                      <p>{submitStatus.message}</p>
                    </div>
                    <div className="modal-footer">
                      <button className="modal-btn" onClick={closeModal}>Đã hiểu</button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="input-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                    />
                  </div>
                  <div className="input-group">
                    <label>Chủ đề cần tư vấn</label>
                    <select name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="">Chọn chủ đề</option>
                      <option value="product-inquiry">Tư vấn sản phẩm</option>
                      <option value="quote">Yêu cầu báo giá</option>
                      <option value="partnership">Hợp tác kinh doanh</option>
                      <option value="other">Ý kiến khác</option>
                    </select>
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Nội dung chi tiết *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hãy cho chúng tôi biết nhu cầu của bạn..."
                    rows="4"
                    required
                  />
                </div>

                <div className="form-footer">
                  <p className="required-note">* Thông tin bắt buộc</p>
                  <button type="submit" className="premium-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaPaperPlane />
                    )}
                    <span>{isSubmitting ? "Đang gửi đi..." : "Gửi yêu cầu ngay"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: FAQ Section */}
            <div className="contact-faq-container">
              <div className="section-header">
                <h2>Thắc mắc phổ biến</h2>
                <p>Giải đáp nhanh các vấn đề khách hàng thường gặp.</p>
              </div>

              <div className="premium-faq-list">
                {faqData.map((item, index) => (
                  <div key={index} className={`faq-card ${openFaq === index ? 'active' : ''}`}>
                    <button className="faq-toggle" onClick={() => toggleFaq(index)}>
                      <span>{item.question}</span>
                      <FaChevronDown className="toggle-icon" />
                    </button>
                    <div className="faq-content">
                      <div className="faq-content-inner">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="social-connect">
                <h3>Kết nối với chúng tôi</h3>
                <div className="social-pills">
                  <a href="https://facebook.com" className="social-pill fb">
                    <FaFacebookF /> <span>Facebook</span>
                  </a>
                  <div className="social-pill zl">
                    <span>Zalo: 0901 436 234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
