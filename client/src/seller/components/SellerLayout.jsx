import React, { useState } from "react";
// 1. Import Outlet để hiển thị nội dung con
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
// 2. Import useAuth để lấy thông tin user chuẩn từ Context
import { useAuth } from "../../contexts/AuthContext";

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 4. Lấy user và hàm logout từ Context
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/seller/dashboard", label: "Tổng Quan", icon: "📊" },
    { path: "/seller/products", label: "Sản Phẩm", icon: "🛍️" },
    { path: "/seller/orders", label: "Đơn Hàng", icon: "📦" },
    { path: "/seller/messages", label: "Tin Nhắn", icon: "💬" },
    { path: "/seller/flash-sales", label: "Flash Sale", icon: "⚡" },

    { path: "/seller/inventory", label: "Tồn Kho", icon: "📋" },
    { path: "/seller/finance", label: "Tài Chính", icon: "💰" },
    // { path: "/seller/analytics", label: "Phân Tích", icon: "📈" },
    { path: "/seller/shop", label: "Cửa Hàng", icon: "🏪" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-green-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-green-800 flex items-center justify-between h-16">
          {sidebarOpen && (
            <h1 className="text-xl font-bold tracking-wide">SELLER</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-green-800 rounded"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="mt-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 transition-colors mb-1 ${
                isActive(item.path)
                  ? "bg-green-800 border-l-4 border-yellow-400"
                  : "hover:bg-green-800 border-l-4 border-transparent"
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find((i) => isActive(i.path))?.label ||
                "Kênh người bán"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-700">
                {user?.username || "Seller"}
              </div>
              <div className="text-xs text-gray-500">Shop Owner</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 text-sm font-medium border border-red-200 transition"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* 👇 QUAN TRỌNG: Thay {children} bằng <Outlet /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
