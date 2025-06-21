import React from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";

import HomePage from "../Home/HomePage";
import SearchPage from "../Home/SearchPage";
import CartPage from "../Home/CartPage";
import UserPage from "../Home/UserPage";

function Home({ setIsLoggedIn }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const navLinks = [
    { to: "/home", label: "Trang chủ", icon: <FaHome /> },
    { to: "/home/search", label: "Tìm kiếm", icon: <FaSearch /> },
    { to: "/home/cart", label: "Giỏ hàng", icon: <FaShoppingCart /> },
    { to: "/home/user", label: "User", icon: <FaUser /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav
        className="flex flex-wrap justify-center sm:justify-around bg-yellow-100 text-yellow-800 py-4 shadow-md
"
      >
        {navLinks.map((link, index) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white text-yellow-600 font-semibold"
                  : "hover:bg-yellow-400"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Nội dung */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path="/contact" element={<ContactPage />} />*/}
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
