import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Dùng NavLink để xử lý trạng thái Active
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import SearchBar from "../common/SearchBar";
import {
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  Menu,
  X,
} from "lucide-react"; // Dùng Lucide icon cho đồng bộ

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    { name: "Hỗ trợ", path: "/support" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Thiết kế lại đậm nét hơn */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl italic tracking-tighter">
                NT
              </span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              Shop<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation - Tối ưu Typography */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-200
                  ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Bo tròn mềm mại hơn */}
          <div className="hidden xl:block flex-1 max-w-sm mx-8">
            <SearchBar />
          </div>

          {/* Actions Group */}
          <div className="flex items-center space-x-2 md:space-x-5">
            {/* Cart - Thiết kế Badge nổi bật */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group"
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu - Thiết kế cao cấp hơn */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-full transition-all"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden md:inline text-sm font-semibold text-gray-700">
                    {user?.name?.split(" ").pop()}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu thiết kế lại */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Tài khoản</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user?.name}
                      </p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <UserCircle size={18} /> <span>Hồ sơ của tôi</span>
                    </Link>
                    <Link
                      to="/account"
                      state={{ activeTab: "orders" }}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Package size={18} /> <span>Đơn hàng đã mua</span>
                    </Link>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                      >
                        <LogOut size={18} /> <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  backgroundColor: "#2563EB", // blue-600
                  color: "#FFFFFF",
                  opacity: 1,
                }}
                className="
    px-8 py-3
    rounded-full
    font-semibold
    shadow-lg
    active:scale-95
  "
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Cải tiến đẹp hơn */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-right">
          <div className="p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-black text-blue-600 italic">
                NTShop
              </span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-gray-800 hover:text-blue-600"
                >
                  {link.name}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="pt-6 space-y-4 flex flex-col">
                  <Link
                    to="/login"
                    className="text-center py-4 bg-blue-600 text-white rounded-2xl font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-4 bg-gray-100 text-gray-800 rounded-2xl font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
