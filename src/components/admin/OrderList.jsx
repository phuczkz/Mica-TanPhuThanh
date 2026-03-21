import React, { useState, useEffect } from "react";
import { listenToOrders, updateOrderStatus, deleteOrder } from "../../services/orderService";
import { PackageOpen, Clock, CheckCircle, XCircle, Trash2, Calendar, Phone, Mail, FileText, ChevronDown, ChevronUp, Filter } from "lucide-react";

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const unsubscribe = listenToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (window.confirm("Bạn có chắc chắn muốn đổi trạng thái đơn này?")) {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (err) {
        alert("Có lỗi khi cập nhật trạng thái!");
      }
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Cảnh báo: Hành động này sẽ xóa vĩnh viễn dữ liệu báo giá này. Tiếp tục?")) {
      try {
        await deleteOrder(orderId);
      } catch (err) {
        alert("Có lỗi khi xóa đơn!");
      }
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Chờ Xử Lý</span>;
      case "contacted":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Phone size={12}/> Đã Liên Hệ</span>;
      case "completed":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Chốt Đơn</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Hủy Bỏ</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">Mới</span>;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    }).format(date);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <h2 className="text-2xl font-bold flex items-center text-brand-navy">
          <PackageOpen className="mr-3 text-brand-orange" /> Danh sách Báo Giá
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-1 sm:flex-none items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 sm:py-1.5 focus-within:border-brand-orange transition-colors">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">⏳ Chờ xử lý</option>
              <option value="contacted">📞 Đã liên hệ</option>
              <option value="completed">✅ Đã chốt đơn</option>
              <option value="cancelled">❌ Đã hủy</option>
            </select>
          </div>
          
          <span className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 sm:py-1 rounded-lg text-sm font-semibold shrink-0">
             Kết quả: {filteredOrders.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-orange border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
          <PackageOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Không tìm thấy yêu cầu báo giá nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col transition-all hover:border-brand-blue">
              {/* Card Header (Row) */}
              <div 
                className="bg-gray-50 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4 w-full lg:w-1/3">
                  <div className="flex-shrink-0">
                    {getStatusBadge(order.status)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{order.customer?.name}</h3>
                    <div className="text-xs text-brand-orange flex items-center mt-1">
                      <Calendar size={12} className="mr-1" /> {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full lg:w-2/3">
                  <div className="flex flex-col text-sm">
                     <span className="text-gray-600 font-medium">{order.totalItems} SP</span>
                     <span className="text-brand-orange font-bold">{(order.totalAmount || 0).toLocaleString("vi-VN")} đ</span>
                  </div>

                  <div className="flex flex-col ml-4">
                     <span className="text-xs text-gray-500 font-medium mb-1">Cập nhật lúc: {formatDate(order.updatedAt)}</span>
                     <select
                       className="border border-gray-300 rounded p-1 text-sm bg-white cursor-pointer font-medium outline-none focus:border-brand-orange"
                       value={order.status || "pending"}
                       onChange={(e) => {
                         e.stopPropagation();
                         handleStatusChange(order.id, e.target.value);
                       }}
                       onClick={e => e.stopPropagation()}
                     >
                       <option value="pending">⏳ Chờ xử lý</option>
                       <option value="contacted">📞 Đã gọi điện/Liên hệ</option>
                       <option value="completed">✅ Đã chốt đơn/Báo giá xong</option>
                       <option value="cancelled">❌ Đã hủy/Từ chối</option>
                     </select>
                  </div>

                  <div className="flex items-center ml-4 gap-2">
                     <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded transition-colors"
                        title="Xóa đơn hàng"
                     >
                        <Trash2 size={18} />
                     </button>
                     <div className="p-2 text-gray-400">
                        {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                     </div>
                  </div>
                </div>
              </div>

              {/* Card Body (Detail Expand) */}
              {expandedOrderId === order.id && (
                <div className="p-6 bg-white border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8 animation-fade-in">
                  
                  {/* Customer Left */}
                  <div className="space-y-4">
                     <h4 className="font-bold text-brand-navy border-b pb-2 flex items-center gap-2"><User size={18}/> Thông Tin Khách Hàng</h4>
                     <ul className="space-y-3 text-sm">
                       <li className="flex gap-2">
                         <span className="text-gray-500 w-24 flex items-center gap-1"><Phone size={14}/> SĐT/Zalo:</span> 
                         <a href={`tel:${order.customer?.phone}`} className="font-semibold text-brand-orange hover:underline">{order.customer?.phone}</a>
                       </li>
                       <li className="flex gap-2">
                         <span className="text-gray-500 w-24 flex items-center gap-1"><Mail size={14}/> Email:</span> 
                         <span className="font-medium">{order.customer?.email || "Trống"}</span>
                       </li>
                       {order.customer?.note && (
                         <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800">
                           <span className="font-semibold block mb-1 text-xs uppercase flex items-center gap-1"><FileText size={12}/> Ghi chú của khách:</span>
                           {order.customer.note}
                         </li>
                       )}
                     </ul>
                  </div>

                 {/* Order Items Right */}
                 <div>
                    <h4 className="font-bold text-brand-navy border-b pb-2 flex items-center gap-2"><PackageOpen size={18}/> Mặt Hàng Cần Mua</h4>
                    <ul className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2 styled-scroll">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-gray-50 p-2 rounded border border-gray-100">
                          <img src={item.imageBase64 || "https://via.placeholder.com/40"} alt={item.name} className="w-12 h-12 object-cover rounded border border-gray-200" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                               <span>SL: <b className="text-brand-orange">{item.quantity}</b></span>
                               <span>•</span>
                               <span>Đơn giá: {item.price ? item.price.toLocaleString("vi-VN") + "đ" : "LH"}</span>
                               {item.selectedColor && (
                                 <span className="flex items-center gap-1 border px-1 rounded">
                                   <i className="w-2 h-2 rounded-full" style={{backgroundColor: item.selectedColor.hex}}></i>
                                   Màu {item.selectedColor.name}
                                 </span>
                               )}
                               {item.selectedSize && (
                                 <span className="border px-1 rounded">Size: {item.selectedSize}</span>
                               )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                 </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const User = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
