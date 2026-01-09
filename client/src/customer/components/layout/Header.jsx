import React, { useState, useEffect, useRef } from "react"; // Thêm useRef và useEffect
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import SearchBar from "../common/SearchBar";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. THÊM: State để quản lý menu user (click để mở)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 2. THÊM: Ref để xử lý click ra ngoài thì đóng menu
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false); // Đóng menu khi logout
  };

  // 3. THÊM: Hàm xử lý click ra ngoài để đóng menu user
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "Flash Sale", path: "/flash-sale" },
    { name: "Support", path: "/support" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">NTShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu - SỬA LẠI LOGIC CLICK */}
            {isAuthenticated ? (
              // Thêm ref vào div bao ngoài
              <div className="relative" ref={userMenuRef}>
                <button
                  // 4. THÊM: Sự kiện onClick để đảo ngược trạng thái mở/đóng
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="hidden md:inline text-gray-700">
                    {user?.name || "User"}
                  </span>
                  {/* Thêm mũi tên nhỏ để chỉ thị đây là dropdown */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {/* 5. SỬA: Thay class group-hover bằng logic render theo state */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm text-gray-700"
                      onClick={() => setIsUserMenuOpen(false)} // Đóng menu khi click link
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm text-gray-700"
                      onClick={() => setIsUserMenuOpen(false)} // Đóng menu khi click link
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ... (Phần Mobile Search Bar và Mobile Menu giữ nguyên) ... */}
        {/* Mobile Search Bar */}
        <div className="md:hidden py-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t mt-2 py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
