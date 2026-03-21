import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Khởi tạo state từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("mica_cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error("Failed to parse cart", e);
      return [];
    }
  });

  // Lưu vào localStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("mica_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Nhận diện sản phẩm bằng ID gốc + Biến thể
      const cartId = `${product.id}_${product.selectedColor?.id || 'none'}_${product.selectedSize || 'none'}`;
      
      const existingProductIndex = prevItems.findIndex((item) => item.cartId === cartId);
      
      if (existingProductIndex >= 0) {
        // Nâng số lượng nếu đã có trong giỏ
        const updatedItems = [...prevItems];
        updatedItems[existingProductIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Thêm mới với data cần thiết
        const cartProduct = {
          cartId: cartId,
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          imageBase64: product.imageBase64, 
          productCode: product.productCode,
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize,
          quantity: quantity
        };
        return [...prevItems, cartProduct];
      }
    });
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };
  
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng trong CartProvider");
  }
  return context;
}
