import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ CHỈ import Routes, Route
// ❌ XÓA: import { BrowserRouter as Router } from "react-router-dom";

import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./components/hooks/useAuth";
import CustomerLayout from "./components/layout/CustomerLayout";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import WishlistPage from "./pages/WishlistPage";
import SupportPage from "./pages/SupportPage";

function CustomerApp() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* ❌ XÓA <Router> wrapper */}
        <CustomerLayout>
          <Routes>
            {" "}
            {/* ✅ Chỉ có Routes, không có Router */}
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<ProductListingPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<ProductListingPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/support" element={<SupportPage />} />
            {/* Fallback route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </CustomerLayout>
        {/* ❌ XÓA </Router> */}
      </CartProvider>
    </AuthProvider>
  );
}

export default CustomerApp;
