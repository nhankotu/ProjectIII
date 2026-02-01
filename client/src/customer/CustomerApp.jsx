import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Contexts
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { SocketProvider } from "../contexts/SocketContext";
import { ChatProvider } from "../contexts/ChatContext";
import { NotificationProvider } from "../contexts/NotificationContext";
// Layout
import CustomerLayout from "./components/layout/CustomerLayout";

// Components
import ChatWidget from "./components/chat/ChatWidget";
import ProtectedRoute from "../global/components/ProtectedRoute"; // 🔥 1. IMPORT PROTECTED ROUTE

// Pages
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import FlashSalePage from "./pages/FlashSalePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ShopPage from "./pages/ShopPage";
import AddressPage from "./pages/AddressPage";
import ScrollToTop from "./components/layout/ScrollToTop";
// Sub-pages của Account
import ProfileTab from "./components/account/ProfileTab";
import OrdersTab from "./components/account/OrdersTab";

// Auth pages
import Login from "../global/pages/Login";
import Register from "../global/pages/Register";

// 🔥 2. IMPORT TRANG CHAT KHÁCH HÀNG (Đường dẫn tùy nơi bạn lưu file)
import CustomerChatPage from "./pages/CustomerChatPage";

function CustomerApp() {
  const location = useLocation();

  const shouldShowChat = () => {
    const path = location.pathname;
    if (path.startsWith("/messages")) return false;
    if (path.startsWith("/product/")) return true;
    if (path.startsWith("/shop/")) return true;
    if (path.includes("/account/orders/")) return true;
    return false;
  };

  return (
    <AuthProvider>
      <ScrollToTop />
      <SocketProvider>
        <ChatProvider>
          <NotificationProvider>
            <CartProvider>
              <CustomerLayout>
                <Routes>
                  {/* --- Public Pages --- */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/flash-sale" element={<FlashSalePage />} />
                  <Route path="/products" element={<ProductListingPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route
                    path="/products/:category"
                    element={<ProductListingPage />}
                  />

                  {/* --- Detail Pages --- */}
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/shop/:id" element={<ShopPage />} />

                  {/* --- Transaction Pages --- */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />

                  {/* --- Account Routes --- */}
                  <Route path="/account" element={<AccountPage />}>
                    {/* 1. Vào /account thì mặc định hiện Profile */}
                    <Route index element={<Navigate to="profile" replace />} />

                    {/* 2. Các tab chính */}
                    <Route path="profile" element={<ProfileTab />} />
                    <Route path="orders" element={<OrdersTab />} />
                    <Route path="addresses" element={<AddressPage />} />

                    {/* 3. CHI TIẾT ĐƠN HÀNG NẰM TRONG NÀY ĐỂ HIỆN TRONG OUTLET */}
                    <Route path="orders/:id" element={<OrderDetailPage />} />
                  </Route>

                  {/* --- Auth --- */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* --- 🔥 3. ROUTE TIN NHẮN (ĐÃ SỬA) --- */}
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        {/* Không cần bao bọc Layout ở đây nữa vì CustomerLayout đã bao ngoài Routes rồi */}
                        <CustomerChatPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                {shouldShowChat() && <ChatWidget />}
              </CustomerLayout>
            </CartProvider>
          </NotificationProvider>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default CustomerApp;
