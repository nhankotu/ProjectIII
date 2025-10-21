// src/admin/components/AdminLayout.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // User data - có thể lấy từ localStorage sau
  const user = {
    username: "Admin",
    role: "admin",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Tổng Quan", icon: "📊" },
    { path: "/admin/users", label: "Quản Lý Users", icon: "👥" },
    { path: "/admin/sellers", label: "Quản Lý Seller", icon: "🏪" },
    { path: "/admin/products", label: "Duyệt Sản Phẩm", icon: "🛍️" },
    { path: "/admin/categories", label: "Danh Mục", icon: "📁" },
    { path: "/admin/orders", label: "Đơn Hàng", icon: "📦" },
    { path: "/admin/financial", label: "Tài Chính", icon: "💰" },
    { path: "/admin/system", label: "Cấu Hình", icon: "⚙️" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-800 text-white transition-all duration-300`}
      >
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-700 rounded"
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
                  ? "bg-blue-700 border-r-4 border-white"
                  : "hover:bg-blue-700"
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
              <p className="text-sm text-gray-600">Vai trò: {user.role}</p>
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

export default AdminLayout;
