import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

// Additional cart utilities
export const useCartUtils = () => {
  const { items } = useCart();

  const getItemQuantity = (productId) => {
    const item = items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return items.some((item) => item.id === productId);
  };

  const getCartSummary = () => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      totalItems,
      totalPrice,
      itemCount: items.length,
    };
  };

  return {
    getItemQuantity,
    isInCart,
    getCartSummary,
  };
};
