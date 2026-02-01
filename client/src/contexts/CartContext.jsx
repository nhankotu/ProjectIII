import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cartAPI } from "../customer/services/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. LOAD GIỎ HÀNG (Đã sửa lại Mapping chuẩn khớp với Backend)
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await cartAPI.getCart();

      const remoteData = res.data.data || res.data;

      if (remoteData && Array.isArray(remoteData.items)) {
        const items = remoteData.items
          .map((item) => {
            if (!item || !item.product) return null;

            return {
              _id: item._id,
              productId: item.product._id,

              // Thông tin hiển thị
              name: item.product.name,
              slug: item.product.slug,

              // Xử lý Thumbnail
              thumbnail:
                typeof item.product.thumbnail === "string"
                  ? item.product.thumbnail
                  : item.product.thumbnail?.url ||
                    "https://placehold.co/100?text=NoImg",

              price: item.product.price || 0,
              quantity: item.quantity,
              stock: item.product.stock,

              // Biến thể
              variant: item.sku
                ? {
                    sku: item.sku,
                    options: item.variantOptions,
                  }
                : null,

              isInvalid: item.isInvalid || false,
            };
          })
          .filter((item) => item !== null);

        setCartItems(items);
      } else {
        console.log("⚠️ [FE] Không tìm thấy mảng items");
        setCartItems([]);
      }
    } catch (error) {
      console.error("❌ Lỗi load cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // 2. TÍNH TỔNG TIỀN & LƯU LOCALSTORAGE
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0,
    );
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartCount(count);

    if (!isAuthenticated)
      localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, isAuthenticated]);

  const addToCart = async ({ product, quantity = 1, variant = null }) => {
    const newItem = {
      ...product,
      productId: product._id,
      quantity,
      variant: variant,
      thumbnail:
        variant?.image?.url || product.thumbnail?.url || product.thumbnail,
      price: variant ? variant.price : product.price,
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          (variant ? item.variant?.sku === variant.sku : !item.variant),
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...newItem, _id: `temp-${Date.now()}` }];
    });

    // B. Gọi API đồng bộ với Backend
    if (isAuthenticated) {
      try {
        const payload = {
          productId: product._id, // Đảm bảo lấy đúng ID
          quantity,
          variant: variant ? { sku: variant.sku } : null,
        };

        await cartAPI.addToCart(payload);

        // Sau khi thêm thành công, fetch lại để lấy _id thật của dòng cart từ server
        fetchCart();
      } catch (error) {
        console.error(
          "Lỗi thêm giỏ hàng:",
          error.response?.data || error.message,
        );
        // Nếu lỗi, nên fetch lại để rollback UI về trạng thái đúng của server
        fetchCart();
      }
    }
  };

  // 4. REMOVE (Sử dụng itemId - chính là item._id)
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(itemId);
      } catch (e) {
        console.error("Lỗi xóa item:", e);
        fetchCart();
      }
    }
  };

  // 5. UPDATE QUANTITY
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) return removeFromCart(itemId);

    setCartItems((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, quantity } : item)),
    );

    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem({ itemId, quantity });
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        fetchCart();
      }
    }
  };

  const clearCart = async (silent = false) => {
    if (!silent && !window.confirm("Xóa toàn bộ giỏ hàng?")) return;
    setCartItems([]);
    localStorage.removeItem("cart");
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error("Lỗi xóa giỏ hàng:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart: (id) => cartItems.some((item) => item.productId === id),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
