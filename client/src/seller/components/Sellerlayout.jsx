// src/seller/components/SellerLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra đăng nhập và role seller
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.role !== "seller") {
        alert("Bạn không có quyền truy cập trang seller!");
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/seller/dashboard", label: "Tổng Quan", icon: "📊" },
    { path: "/seller/products", label: "Sản Phẩm", icon: "🛍️" },
    { path: "/seller/orders", label: "Đơn Hàng", icon: "📦" },
    { path: "/seller/inventory", label: "Tồn Kho", icon: "📋" },
    { path: "/seller/finance", label: "Tài Chính", icon: "💰" },
    { path: "/seller/analytics", label: "Phân Tích", icon: "📈" },
    { path: "/seller/shop", label: "Cửa Hàng", icon: "🏪" },
  ];

  const isActive = (path) => location.pathname === path;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-green-800 text-white transition-all duration-300`}
      >
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">Seller Center</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-green-700 rounded"
            >
              ☰
            </button>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 transition-colors ${
                isActive(item.path)
                  ? "bg-green-700 border-r-4 border-white"
                  : "hover:bg-green-700"
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold">
                Xin chào, {user.username}!
              </h2>
              <p className="text-sm text-gray-600">Seller Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
