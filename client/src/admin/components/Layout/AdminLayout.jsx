import React, { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  User,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  ChevronLeft,
  Menu,
  Package,
  Layers,
  Zap,
  Users,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Tổng Quan",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "/admin/products", label: "Sản Phẩm", icon: <Package size={20} /> },
    {
      path: "/admin/categories",
      label: "Danh Mục",
      icon: <Layers size={20} />,
    },
    {
      path: "/admin/flash-sales",
      label: "Flash Sale",
      icon: <Zap size={20} />,
    },
    { path: "/admin/users", label: "Người Dùng", icon: <Users size={20} /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);
  const currentTab = menuItems.find((i) => isActive(i.path));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- Sidebar (Thanh bên) --- */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1e293b] text-white transition-all duration-300 flex flex-col z-50 shadow-xl`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between h-16">
          {sidebarOpen && (
            <h1 className="text-xl font-bold tracking-tighter text-indigo-400">
              GEMINI<span className="text-white">SHOP</span>
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6 flex-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 mb-2 group ${
                isActive(item.path)
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span
                className={`${sidebarOpen ? "mr-3" : "mx-auto"} transition-all`}
              >
                {item.icon}
              </span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- Header (Đã loại bỏ Tìm kiếm & Thông báo) --- */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Bên trái Header: Breadcrumbs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm text-gray-400 gap-2">
              <span className="hover:text-gray-600 cursor-default">Admin</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {currentTab?.label || "Trang quản trị"}
              </span>
            </div>
          </div>

          {/* Bên phải Header: Profile & Logout */}
          <div className="flex items-center gap-4">
            {/* Thông tin User */}
            <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900 leading-none mb-1">
                  {user?.username || "Quản trị viên"}
                </div>
                <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                  {user?.role || "Administrator"}
                </div>
              </div>

              {/* Avatar Icon */}
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                <User size={20} />
              </div>

              {/* Nút Đăng xuất */}
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all group"
                title="Đăng xuất"
              >
                <LogOut
                  size={20}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </header>

        {/* --- Vùng nội dung chính --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
