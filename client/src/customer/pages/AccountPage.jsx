import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
// 👇 1. Import API để lấy dữ liệu
import { userAPI } from "../services/api";

import ProfileTab from "../components/account/ProfileTab";
import OrdersTab from "../components/account/OrdersTab";
import AddressTab from "../components/account/AddressTab";

const AccountPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // 👇 2. Thêm State lưu danh sách địa chỉ
  const [addresses, setAddresses] = useState([]);

  // 👇 3. Hàm gọi API lấy danh sách địa chỉ (Callback truyền xuống con)
  const fetchAddresses = async () => {
    try {
      const response = await userAPI.getAddresses();
      // Xử lý dữ liệu trả về an toàn (Backend có thể trả mảng hoặc object)
      const list = Array.isArray(response) ? response : response.data || [];
      setAddresses(list);
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    }
  };

  // 👇 4. Gọi hàm lấy dữ liệu khi mới vào trang
  useEffect(() => {
    if (activeTab === "address") {
      fetchAddresses();
    }
  }, [activeTab]); // Chỉ gọi khi chuyển sang tab address hoặc khi mới vào

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "orders", name: "Orders", icon: "📦" },
    { id: "address", name: "Address", icon: "🏠" },
    { id: "wishlist", name: "Wishlist", icon: "❤️" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className="py-8 container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* User Info */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-blue-600">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{user?.name || "User"}</h3>
                <p className="text-gray-600 text-sm">
                  {user?.email || "user@example.com"}
                </p>
                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Verified Account
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3 text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-8 flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
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
              Logout
            </button>
          </div>

          {/* Account Stats */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold mb-4">Account Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Orders</span>
                <span className="font-bold text-yellow-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-bold text-green-600">5,240,000 ₫</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Wishlist Items</span>
                <span className="font-bold">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Tab Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find((t) => t.id === activeTab)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your{" "}
                  {tabs.find((t) => t.id === activeTab)?.name.toLowerCase()}{" "}
                  settings
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Member since{" "}
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "orders" && <OrdersTab />}

              {/* 👇 5. PHẦN QUAN TRỌNG NHẤT: Đã truyền props xuống AddressTab */}
              {activeTab === "address" && (
                <AddressTab
                  addresses={addresses}
                  onAddressUpdate={fetchAddresses}
                />
              )}

              {activeTab === "wishlist" && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">❤️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Save items you love for later
                  </p>
                  <button className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium">
                    Start Shopping
                  </button>
                </div>
              )}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                  {/* ... Code Security giữ nguyên ... */}
                  <p className="text-gray-500">Security settings content...</p>
                </div>
              )}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">
                    Notification Preferences
                  </h3>
                  {/* ... Code Notifications giữ nguyên ... */}
                  <p className="text-gray-500">
                    Notification settings content...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="font-medium text-blue-900">Track Order</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <span className="font-medium text-green-900">Return Item</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="font-medium text-purple-900">
                Contact Support
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
