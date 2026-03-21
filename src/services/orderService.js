import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

const ORDERS_COLLECTION = "orders";

// 1. Lưu Đơn báo giá mới
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: "pending", // Trạng thái: Mới
      isViewed: false, // Thêm Cờ báo Chưa xem
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

// 2. Lấy danh sách Đơn báo giá (Real-time)
export const listenToOrders = (callback) => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(orders);
    },
    (error) => {
      console.error("Lỗi khi lắng nghe đơn hàng:", error);
    }
  );
};

// 3. Cập nhật trạng thái Đơn
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn:", error);
    throw error;
  }
};

// 4. Xóa Đơn (Tùy chọn)
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
    throw error;
  }
};

// 5. Đánh dấu tất cả là "Đã xem" (Xóa badge thông báo)
export const markAllOrdersAsViewed = async (orders) => {
  try {
    const unviewedOrders = orders.filter(o => !o.isViewed);
    if (unviewedOrders.length === 0) return;
    
    await Promise.all(unviewedOrders.map(o => {
      const orderRef = doc(db, ORDERS_COLLECTION, o.id);
      return updateDoc(orderRef, { isViewed: true });
    }));
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã xem:", error);
  }
};
