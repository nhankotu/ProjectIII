import React, { createContext, useState, useContext, useEffect } from "react";
// 1. Import Auth để biết khi nào user đăng nhập
import { useAuth } from "./AuthContext";
// 2. Import API để gọi về Server
import { cartAPI } from "../customer/services/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // =================================================================
  // 1. LOAD GIỎ HÀNG (API nếu đã login, LocalStorage nếu chưa)
  // =================================================================
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        // --- CASE A: ĐÃ ĐĂNG NHẬP -> GỌI API ---
        try {
          setLoading(true);
          const res = await cartAPI.getCart();
          if (res.data && res.data.items) {
            // Backend thường trả về cấu trúc: { product: {...}, quantity: 1 }
            // Cần flatten nó ra để dễ hiển thị nếu cần, hoặc giữ nguyên tuỳ UI
            // Ở đây mình giả sử bạn map lại cho giống cấu trúc localStorage
            const items = res.data.items.map((item) => ({
              ...item.product, // Thông tin sản phẩm
              quantity: item.quantity,
              // Lưu lại product ID gốc để gửi lên server các lần sau
              productId: item.product._id || item.product.id,
            }));
            setCartItems(items);
          }
        } catch (error) {
          console.error("Lỗi tải giỏ hàng từ server:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // --- CASE B: CHƯA ĐĂNG NHẬP -> DÙNG LOCALSTORAGE ---
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error("Lỗi parse cart local:", error);
          }
        }
      }
    };

    fetchCart();
  }, [isAuthenticated]); // Chạy lại mỗi khi trạng thái đăng nhập thay đổi

  // =================================================================
  // 2. TÍNH TỔNG TIỀN (Chạy mỗi khi cartItems thay đổi)
  // =================================================================
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    setCartTotal(total);
    setCartCount(count);

    // Nếu chưa đăng nhập thì lưu local để backup
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // =================================================================
  // 3. THÊM VÀO GIỎ (ADD TO CART)
  // =================================================================
  const addToCart = async (product, quantity = 1) => {
    // A. Cập nhật UI ngay lập tức (Optimistic UI)
    const newItem = { ...product, quantity };

    // Chuẩn hóa ID: Backend dùng _id, Frontend có thể dùng id
    const productId = product._id || product.id;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => (item._id || item.id) === productId
      );
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, newItem];
      }
    });

    // B. Nếu đã đăng nhập -> Gọi API đồng bộ
    if (isAuthenticated) {
      try {
        await cartAPI.addToCart({ productId, quantity });
      } catch (error) {
        console.error("Lỗi thêm vào giỏ hàng server:", error);
        // Có thể revert lại state nếu cần thiết
      }
    }
  };

  // =================================================================
  // 4. XÓA KHỎI GIỎ (REMOVE)
  // =================================================================
  const removeFromCart = async (productId) => {
    // Update UI
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== productId)
    );

    // Call API
    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(productId);
      } catch (error) {
        console.error("Lỗi xóa sản phẩm server:", error);
      }
    }
  };

  // =================================================================
  // 5. CẬP NHẬT SỐ LƯỢNG (UPDATE QUANTITY)
  // =================================================================
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Update UI
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );

    // Call API
    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem({ productId, quantity });
      } catch (error) {
        console.error("Lỗi cập nhật số lượng server:", error);
      }
    }
  };

  // =================================================================
  // 6. XÓA HẾT GIỎ (CLEAR)
  // =================================================================
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem("cart");

    // Lưu ý: Thường Backend không có API clearCart riêng,
    // hoặc bạn phải loop xóa từng cái, hoặc tạo thêm API clearCart.
    // Tạm thời nếu logout thì state sẽ tự clear do useEffect ở trên.
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => (item._id || item.id) === productId);
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading, // Thêm loading để hiển thị spinner nếu cần
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
