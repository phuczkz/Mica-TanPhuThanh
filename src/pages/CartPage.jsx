import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { createOrder } from "../services/orderService";

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thông tin khách hàng form
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    note: ""
  });

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const confirmCheckout = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. Chuẩn bị dữ liệu order
      const orderPayload = {
        customer: customerInfo,
        items: cartItems.map(item => ({
          productId: item.id || '',
          productCode: item.productCode || '',
          name: item.name || '',
          price: item.price || 0,
          quantity: item.quantity || 1,
          selectedColor: item.selectedColor || null,
          selectedSize: item.selectedSize || null,
          imageBase64: item.imageBase64 || ''
        })),
        totalAmount: getCartTotal(),
        totalItems: cartItems.length,
      };

      // 2. Lưu vào Firebase
      await createOrder(orderPayload);

      // 3. Thông báo và reset
      alert("Đã gửi Yêu cầu Báo Giá thành công! Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.");
      clearCart();
      setShowCheckoutModal(false);
      navigate("/");

    } catch (error) {
      console.error("Lỗi chi tiết CreateOrder:", error);
      alert(`Đã xảy ra lỗi: ${error.message || 'Vui lòng thử lại sau!'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Hãy quay lại trang cửa hàng để chọn thêm những vật tư quảng cáo chất lượng nhé!
        </p>
        <Link to="/products" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-8 flex items-center">
          Giỏ Hàng <span className="ml-3 text-lg font-medium text-gray-500">({cartItems.length} sản phẩm)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Table */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 text-sm tracking-wider uppercase">
              <div className="col-span-5">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-3 text-right">Tổng</div>
            </div>

            {/* Items List */}
            <div className="relative">
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center relative">
                    {/* Mobile delete button */}
                    <button onClick={() => removeFromCart(item.cartId)} className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2">
                      <Trash2 size={20} />
                    </button>

                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                        {item.imageBase64 ? (
                          <img src={item.imageBase64} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        {item.productCode && <span className="text-xs text-gray-500 font-medium mb-1">Mã: {item.productCode}</span>}
                        <Link to={`/products/${item.id}`} className="font-bold text-gray-900 hover:text-brand-orange text-lg line-clamp-2">
                          {item.name}
                        </Link>
                        {/* Variants Display */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.selectedColor && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-700 shadow-sm border border-gray-200 cursor-default" title="Màu sắc đã chọn">
                                <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: item.selectedColor.hex }}></span>
                                {item.selectedColor.name}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="inline-flex items-center text-xs font-bold bg-gray-100 px-2.5 py-1 rounded text-gray-700 shadow-sm border border-gray-200 cursor-default" title="Kích thước / Độ dày">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                        {item.category && <span className="text-sm text-gray-500 mt-1">{item.category}</span>}
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                      <span className="md:hidden text-gray-500 w-24">Đơn giá:</span>
                      <span className="font-semibold text-gray-700">
                        {item.price ? `${item.price.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                      <span className="md:hidden text-gray-500 w-24">Số lượng:</span>
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden w-32">
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 text-gray-600 transition-colors">
                          <Minus size={14} />
                        </button>
                        <input type="number" readOnly value={item.quantity} className="w-16 h-8 text-center font-medium border-x border-gray-300 focus:outline-none" />
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center shrink-0">
                      <span className="md:hidden text-gray-500 w-24">Tạm tính:</span>
                      <span className="font-bold text-brand-orange text-lg whitespace-nowrap">
                        {item.price ? `${(item.price * item.quantity).toLocaleString("vi-VN")} đ` : "Liên hệ"}
                      </span>

                      <button onClick={() => removeFromCart(item.cartId)} className="hidden md:block ml-4 text-gray-400 hover:text-red-500 transition-colors shrink-0" title="Xóa sản phẩm">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Bóng mờ báo hiệu còn nội dung bên dưới (Fade out hint) */}
              {cartItems.length > 3 && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <Link to="/products" className="flex items-center text-brand-navy hover:text-brand-orange font-medium transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Tiếp tục lựa hàng
              </Link>
              <button onClick={clearCart} className="text-gray-500 hover:text-red-500 font-medium transition-colors text-sm">
                Xóa trống giỏ hàng
              </button>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-navy border-t-[6px] sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Tóm Tắt Đơn Hàng</h3>

              <div className="space-y-4 mb-6 text-gray-700">
                <div className="flex justify-between">
                  <span>Tạm tính phí hàng:</span>
                  <span className="font-semibold">{getCartTotal().toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-gray-500">Báo giá sau</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (Nếu lấy hóa đơn):</span>
                  <span className="font-medium text-gray-500">Chưa gồm VAT</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <strong className="text-lg text-gray-900">Tổng cộng:</strong>
                  <strong className="text-3xl text-brand-orange leading-none">{getCartTotal().toLocaleString("vi-VN")} đ</strong>
                </div>
                <p className="text-xs text-brand-orange/80 mt-2 text-right">*(Chưa bao gồm phí vận chuyển)*</p>
              </div>

              <button onClick={handleCheckout} className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center focus:ring-4 focus:ring-orange-200">
                Gửi Yêu Cầu Báo Giá
              </button>

              <div className="mt-6 bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-100 leading-relaxed">
                <span className="font-bold flex items-center mb-1"><Info size={16} className="mr-1" /> Chính sách bán buôn:</span>
                Gửi yêu cầu hoặc LH Zalo 0901436234 để được nhận giá chiết khấu đặc biệt theo sản lượng. Cắt lấy ngay theo yêu cầu.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin liên hệ</h2>
            <p className="text-gray-500 mb-6">Xin vui lòng để lại thông tin để chuyên viên báo giá của Tấn Phú Thành có thể tư vấn đơn hàng ({cartItems.length} SP) cho bạn.</p>

            <form className="space-y-4" onSubmit={confirmCheckout}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerChange}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2.5 border"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại / Zalo *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2.5 border"
                    placeholder="090..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (nếu có)</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2.5 border"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                <textarea
                  rows="3"
                  name="note"
                  value={customerInfo.note}
                  onChange={handleCustomerChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-orange focus:border-brand-orange p-2.5 border"
                  placeholder="Ví dụ: Cần cắt giùm tấm Mica kích thước 1x2m..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowCheckoutModal(false)} disabled={isSubmitting} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-brand-navy hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50">
                  {isSubmitting ? "⏳ Đang gửi đơn..." : "Xác Nhận & Gửi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
