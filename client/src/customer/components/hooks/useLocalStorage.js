import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Specialized hooks for common use cases

// Cart storage
export const useCartStorage = () => {
  const [cart, setCart] = useLocalStorage("cart", []);

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...currentCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
};

// User preferences storage
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage("userPreferences", {
    theme: "light",
    language: "vi",
    currency: "VND",
    notifications: true,
    recentlyViewed: [],
  });

  const setTheme = (theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language) => {
    setPreferences((prev) => ({ ...prev, language }));
  };

  const toggleNotifications = () => {
    setPreferences((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const addToRecentlyViewed = (product) => {
    setPreferences((prev) => {
      const recentlyViewed = prev.recentlyViewed.filter(
        (p) => p.id !== product.id
      );
      const updated = [product, ...recentlyViewed].slice(0, 10); // Keep last 10 items
      return { ...prev, recentlyViewed: updated };
    });
  };

  const clearRecentlyViewed = () => {
    setPreferences((prev) => ({ ...prev, recentlyViewed: [] }));
  };

  return {
    preferences,
    setTheme,
    setLanguage,
    toggleNotifications,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
};

// Auth token storage
export const useAuthStorage = () => {
  const [token, setToken] = useLocalStorage("authToken", null);
  const [user, setUser] = useLocalStorage("user", null);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    token,
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };
};

// Search history storage
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useLocalStorage(
    "searchHistory",
    []
  );

  const addSearchTerm = (term) => {
    if (!term.trim()) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.term !== term);
      const updated = [{ term, timestamp: Date.now() }, ...filtered].slice(
        0,
        10
      );
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeSearchTerm = (term) => {
    setSearchHistory((prev) => prev.filter((item) => item.term !== term));
  };

  const getRecentSearches = (limit = 5) => {
    return searchHistory.slice(0, limit).map((item) => item.term);
  };

  return {
    searchHistory,
    addSearchTerm,
    clearSearchHistory,
    removeSearchTerm,
    getRecentSearches,
  };
};

// Wishlist storage
export const useWishlistStorage = () => {
  const [wishlist, setWishlist] = useLocalStorage("wishlist", []);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev; // Already in wishlist
      }
      return [...prev, { ...product, addedAt: Date.now() }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  };
};
