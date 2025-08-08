import { useState } from "react";
import { Footer } from "../components/common/Footer";
import "../styles/Contact.css";

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
    setSubmitStatus(null);

    // Validate form
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc (*)!",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Vui lòng nhập email hợp lệ!",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate form submission (you can integrate with a backend service)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus({
        type: "success",
        message:
          "✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "❌ Có lỗi xảy ra. Vui lòng thử lại sau!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-layout">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>📞 Liên hệ với Mica Tấn Phú Thành</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn!</p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>🏢 Thông tin liên hệ</h2>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-details">
                <h3>Địa chỉ</h3>
                <p>
                  705 Đường Cách Mạng Tháng Tám
                  <br />
                  Chánh Nghĩa, Thủ Dầu Một, Bình Dương, Việt Nam
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-details">
                <h3>Điện thoại</h3>
                <p>
                  <a href="tel:+84123456789">+84 123 456 789</a>
                  <br />
                  <a href="tel:+84987654321">+84 987 654 321</a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-details">
                <h3>Email</h3>
                <p>
                  <a href="mailto:tanphuthanh@gmail.com">
                    tanphuthanh@gmail.com
                  </a>
                  <br />
                  <a href="mailto:support@tanphuthanh.com">
                    support@tanphuthanh.com
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕒</div>
              <div className="info-details">
                <h3>Giờ làm việc</h3>
                <p>
                  Thứ 2 - Thứ 6: 8:00 - 18:00
                  <br />
                  Thứ 7: 8:00 - 12:00
                  <br />
                  Chủ nhật: Nghỉ
                </p>
              </div>
            </div>

            <div className="social-links">
              <h3>🌐 Mạng xã hội</h3>
              <div className="social-icons">
                <a
                  href="https://facebook.com/micatanphuthanh"
                  className="social-icon facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📘 Facebook
                </a>
                <a
                  href="https://instagram.com/micatanphuthanh"
                  className="social-icon instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📷 Instagram
                </a>
                <a
                  href="https://zalo.me/micatanphuthanh"
                  className="social-icon zalo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 Zalo
                </a>
                <a
                  href="https://youtube.com/@micatanphuthanh"
                  className="social-icon youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📺 YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>📝 Gửi tin nhắn cho chúng tôi</h2>

            {submitStatus && (
              <div className={`alert ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Chủ đề</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="product-inquiry">Hỏi về sản phẩm</option>
                    <option value="order-support">Hỗ trợ đơn hàng</option>
                    <option value="complaint">Khiếu nại</option>
                    <option value="suggestion">Góp ý</option>
                    <option value="partnership">Hợp tác kinh doanh</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Tin nhắn *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập tin nhắn của bạn..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "⏳ Đang gửi..." : "📤 Gửi tin nhắn"}
                </button>

                <button
                  type="reset"
                  className="reset-btn"
                  onClick={() =>
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    })
                  }
                >
                  🗑️ Xóa form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>🗺️ Vị trí của chúng tôi</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.4045238645477!2d106.65748!3d10.9720828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d13142fc8599%3A0xb0bf871fa00beca8!2s705%20%C4%90.%20C%C3%A1ch%20M%E1%BA%A1ng%20Th%C3%A1ng%20T%C3%A1m%2C%20Ch%C3%A1nh%20Ngh%C4%A9a%2C%20Th%E1%BB%A7%20D%E1%BA%A7u%20M%E1%BB%99t%2C%20B%C3%ACnh%20D%C6%B0%C6%A1ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1723156789123!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí cửa hàng"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>❓ Câu hỏi thường gặp</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>🚚 Chính sách giao hàng như thế nào?</h3>
              <p>
                Chúng tôi giao hàng miễn phí trong nội thành TP.HCM cho đơn hàng
                từ 10,000,000 VNĐ. Thời gian giao hàng từ 1-3 ngày làm việc.
              </p>
            </div>

            <div className="faq-item">
              <h3>💳 Tôi có thể thanh toán bằng cách nào?</h3>
              <p>
                Chúng tôi chấp nhận thanh toán bằng tiền mặt khi nhận hàng,
                chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thẻ tín
                dụng.
              </p>
            </div>

            <div className="faq-item">
              <h3>🔄 Chính sách đổi trả như thế nào?</h3>
              <p>
                Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận
                hàng, với điều kiện sản phẩm còn nguyên vẹn và chưa sử dụng.
              </p>
            </div>

            <div className="faq-item">
              <h3>🛡️ Sản phẩm có được bảo hành không?</h3>
              <p>
                Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản
                xuất. Thời gian bảo hành từ 6 tháng đến 2 năm tùy loại sản phẩm.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
