import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import { useChat } from "../../../contexts/ChatContext"; // 🔥 1. IMPORT CHAT CONTEXT
import { useNotification } from "../../../contexts/NotificationContext"; // 🔥 2. IMPORT NOTIFICATION CONTEXT
import SearchBar from "../common/SearchBar";
import {
  ShoppingCart,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  UserCircle,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { cartCount } = useCart();
  const { unreadCount } = useChat(); // 🔥 3. LẤY SỐ TIN NHẮN CHƯA ĐỌC
  const { orderNotiCount, setOrderNotiCount } = useNotification(); // 🔥 4. LẤY SỐ THÔNG BÁO ĐƠN HÀNG

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Sản phẩm", path: "/products" },
    { name: "Danh mục", path: "/categories" },
    { name: "Flash Sale", path: "/flash-sale" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 transition-all">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform shadow-md">
              <span className="text-white font-black text-xl italic tracking-tighter">
                NT
              </span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              Shop<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* 2. DESKTOP NAV & SEARCH */}
          <nav className="hidden lg:flex items-center space-x-1 ml-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-[15px] font-medium rounded-full transition-all ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* 3. ACTIONS */}
          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
            {/* 🔥 TIN NHẮN (Desktop) */}
            {isAuthenticated && (
              <Link
                to="/messages"
                className="relative p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all hidden sm:block"
                title="Tin nhắn"
              >
                <MessageSquare size={24} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white animate-bounce">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* GIỎ HÀNG */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* USER MENU */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-2 py-1.5 hover:bg-gray-100 rounded-full transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.avatar && !imageError ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  {/* 🔥 CHẤM ĐỎ THÔNG BÁO ĐƠN HÀNG TRÊN AVATAR */}
                  {orderNotiCount > 0 && (
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-1">
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <UserCircle size={18} /> <span>Hồ sơ</span>
                      </Link>

                      {/* 🔥 ĐƠN MUA CÓ SỐ THÔNG BÁO */}
                      <Link
                        to="/account/orders"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setOrderNotiCount(0);
                        }}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <div className="flex items-center space-x-3">
                          <Package size={18} /> <span>Đơn mua</span>
                        </div>
                        {orderNotiCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {orderNotiCount} mới
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/account/addresses"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <MapPin size={18} /> <span>Địa chỉ</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 mt-1 pt-1 p-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                      >
                        <LogOut size={18} /> <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Cập nhật badge tin nhắn cho mobile) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-right">
          <div className="p-6 h-full flex flex-col">
            {/* ... logo & search bar ... */}
            <nav className="flex flex-col space-y-4 flex-1">
              {/* ... nav links ... */}
              {isAuthenticated && (
                <NavLink
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-semibold py-2 flex items-center justify-between text-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={20} /> Tin nhắn
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
