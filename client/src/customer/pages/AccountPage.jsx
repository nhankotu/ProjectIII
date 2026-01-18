import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 🔥 BẮT BUỘC PHẢI CÓ
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../services/api";

// Components
import ProfileTab from "../components/account/ProfileTab";
import OrdersTab from "../components/account/OrdersTab";
import AddressTab from "./AddressPage";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AccountPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation(); // Lấy thông tin điều hướng từ Header gửi sang

  // Khởi tạo activeTab: Ưu tiên lấy từ state truyền sang, nếu không có thì mặc định là profile
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "profile"
  );

  const [addresses, setAddresses] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Theo dõi location.state để cập nhật tab khi người dùng click từ Header (ví dụ: đang ở Account mà bấm lại My Orders)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // --- 1. LẤY DỮ LIỆU ĐỊA CHỈ ---
  const fetchAddresses = async () => {
    try {
      setLoadingAddress(true);
      const response = await userAPI.getAddresses();
      // Axios interceptor trả về thẳng response.data hoặc data bọc trong data
      const list = response.data || response || [];
      setAddresses(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Chỉ gọi API khi chuyển sang tab Address
  useEffect(() => {
    if (activeTab === "address") {
      fetchAddresses();
    }
  }, [activeTab]);

  // --- 2. CẤU HÌNH MENU ---
  const tabs = [
    { id: "profile", name: "Hồ sơ", icon: "👤" },
    { id: "orders", name: "Đơn mua", icon: "📦" },
    { id: "address", name: "Địa chỉ", icon: "🏠" },
  ];

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- SIDEBAR TRÁI --- */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
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
                  <h3 className="font-bold text-lg truncate" title={user?.name}>
                    {user?.name || "Khách hàng"}
                  </h3>
                  <p
                    className="text-gray-500 text-sm truncate"
                    title={user?.email}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>

              <hr className="my-6 border-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>

          {/* --- CONTENT PHẢI --- */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {tabs.find((t) => t.id === activeTab)?.name}
                </h2>
              </div>

              <div>
                {/* SỬA: ProfileTab đã tự dùng useAuth() bên trong 
                  nên không cần truyền props user={user} 
                */}
                {activeTab === "profile" && <ProfileTab />}

                {activeTab === "orders" && <OrdersTab />}

                {activeTab === "address" &&
                  (loadingAddress ? (
                    <LoadingSpinner />
                  ) : (
                    <AddressTab
                      addresses={addresses}
                      onAddressUpdate={fetchAddresses}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
