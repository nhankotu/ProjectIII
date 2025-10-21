import React, { createContext, useContext, useReducer, useEffect } from "react";

// Cart item structure
/**
 * @typedef {Object} CartItem
 * @property {string|number} id
 * @property {string} name
 * @property {number} price
 * @property {number} originalPrice
 * @property {string[]} images
 * @property {string} brand
 * @property {number} quantity
 * @property {boolean} inStock
 * @property {string} slug
 */

// Cart context state
/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items
 * @property {number} total
 * @property {number} itemsCount
 */

// Cart actions
/**
 * @typedef {Object} CartActions
 * @property {function(CartItem): void} addToCart
 * @property {function(string|number): void} removeFromCart
 * @property {function(string|number, number): void} updateQuantity
 * @property {function(): void} clearCart
 * @property {function(): number} getCartTotal
 * @property {function(): number} getCartItemsCount
 */

/** @type {React.Context<CartState & CartActions>} */
/** @type {React.Context<CartState & CartActions>} */
export const CartContext = createContext(); // ✅ THÊM export ở đây

// Action types
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer
/**
 * @param {CartState} state
 * @param {Object} action
 * @returns {CartState}
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // New item, add to cart
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const itemId = action.payload;
      const updatedItems = state.items.filter((item) => item.id !== itemId);
      return { ...state, items: updatedItems };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return { ...state, items: updatedItems };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case CART_ACTIONS.LOAD_CART:
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

// Calculate derived values from cart items
/**
 * @param {CartItem[]} items
 * @returns {{total: number, itemsCount: number}}
 */
const calculateCartTotals = (items) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsCount = items.reduce((count, item) => count + item.quantity, 0);

  return { total, itemsCount };
};

// Cart Provider Component
/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Calculate totals whenever items change
  const { total, itemsCount } = calculateCartTotals(state.items);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state.items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state.items]);

  // Cart actions
  /**
   * @param {CartItem} product
   * @param {number} quantity
   */
  const addToCart = (product, quantity = 1) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      images: product.images || [product.image] || [],
      brand: product.brand || "",
      quantity: quantity,
      inStock: product.inStock !== false,
      slug: product.slug || `product-${product.id}`,
    };

    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
  };

  /**
   * @param {string|number} productId
   */
  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  /**
   * @param {string|number} productId
   * @param {number} quantity
   */
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Check if product is in cart
  /**
   * @param {string|number} productId
   * @returns {boolean}
   */
  const isInCart = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  // Get item quantity in cart
  /**
   * @param {string|number} productId
   * @returns {number}
   */
  const getItemQuantity = (productId) => {
    const item = state.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    // State
    items: state.items,
    total,
    itemsCount,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
/**
 * @returns {CartState & CartActions}
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

// Hook for cart badge (header, etc.)
/**
 * @returns {number}
 */
export const useCartItemsCount = () => {
  const { itemsCount } = useCart();
  return itemsCount;
};

// Hook for cart total
/**
 * @returns {number}
 */
export const useCartTotal = () => {
  const { total } = useCart();
  return total;
};
