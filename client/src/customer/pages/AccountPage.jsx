import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // 🔥 Import Outlet & NavLink
import { useAuth } from "../../contexts/AuthContext";
import { User, Package, MapPin, LogOut } from "lucide-react"; // Dùng icon cho đẹp

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Cấu hình menu: path phải trùng với path khai báo trong CustomerApp.jsx
  const tabs = [
    { path: "profile", name: "Hồ sơ", icon: <User size={20} /> },
    { path: "orders", name: "Đơn mua", icon: <Package size={20} /> },
    { path: "addresses", name: "Địa chỉ", icon: <MapPin size={20} /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- SIDEBAR TRÁI --- */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
              {/* User Info */}
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center mr-4 border-2 border-indigo-50">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-indigo-600">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-lg truncate">
                    {user?.name || "Khách hàng"}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Menu Navigation (Dùng NavLink thay vì Button) */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={`/account/${tab.path}`} // Đường dẫn tuyệt đối
                    className={({ isActive }) =>
                      `w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm border-l-4 border-indigo-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </NavLink>
                ))}
              </nav>

              <hr className="my-6 border-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut size={20} className="mr-3" />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* --- CONTENT PHẢI --- */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
              {/* 🔥 QUAN TRỌNG: Outlet là nơi hiển thị Profile/Orders/Address */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
