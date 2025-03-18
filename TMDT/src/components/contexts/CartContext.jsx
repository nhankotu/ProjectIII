// src/components/context/CartContext.js
import React, { createContext, useContext, useState } from "react";

// Tạo Context Giỏ Hàng
const CartContext = createContext();

// Provider Giỏ Hàng
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Nếu đã có, tăng số lượng của sản phẩm
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 } // Tăng số lượng của sản phẩm
            : item
        );
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ với số lượng 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Hàm lấy tổng số lượng sản phẩm trong giỏ
  const getTotalItems = () => {
    return cart.length;
  };

  // Hàm lấy tổng giá trị của giỏ hàng
  const getTotalPrice = () => {
    const total = cart.reduce(
      (total, product) => total + Number(product.price * product.quantity),
      0
    );
    return Math.round(total * 100) / 100; // Làm tròn đến 2 chữ số thập phân
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, getTotalItems, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook dùng để lấy giá trị từ CartContext
export const useCart = () => {
  return useContext(CartContext);
};
