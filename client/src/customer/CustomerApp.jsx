import React from "react";
import { Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";

// Layout
import CustomerLayout from "./components/layout/CustomerLayout";

// Pages
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import FlashSalePage from "./pages/FlashSalePage";
import SupportPage from "./pages/SupportPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import NotFoundPage from "./pages/NotFoundPage";
import WishlistPage from "./pages/WishlistPage";
import AddressPage from "./pages/AddressPage";
import OrderDetailPage from "./pages/OrderDetailPage"; // Thêm dòng này ở khu vực import
// ✅ 1. IMPORT TRANG SHOP PAGE
import ShopPage from "./pages/ShopPage";

// Auth pages (global)
import Login from "../global/pages/Login";
import Register from "../global/pages/Register";

function CustomerApp() {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomerLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/flash-sale" element={<FlashSalePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/products/:category"
              element={<ProductListingPage />}
            />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* ✅ 2. THÊM ROUTE CHO SHOP TẠI ĐÂY */}
            {/* :id sẽ hứng sellerId, ví dụ: /shop/65a1b2... */}
            <Route path="/shop/:id" element={<ShopPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/addresses" element={<AddressPage />} />
            <Route path="/account/orders/:id" element={<OrderDetailPage />} />
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CustomerLayout>
      </CartProvider>
    </AuthProvider>
  );
}

export default CustomerApp;
