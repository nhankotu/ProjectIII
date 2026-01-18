import React from "react";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
const DashboardPage = () => {
  // 1. Gọi Hook
  const { stats, loading } = useAdminDashboard();
  const navigate = useNavigate();

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      path: "/admin/users",
      icon: <Users size={24} />,
      colorClass: "bg-blue-100 text-blue-600",
      change: "Active Users",
      changeType: "neutral",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      path: "/admin/products",
      icon: <Package size={24} />,
      colorClass: "bg-green-100 text-green-600",
      change: `${stats.productBreakdown.pending || 0} chờ duyệt`,
      changeType: "warning",
    },
    {
      title: "Đơn hàng hôm nay",
      value: stats.ordersToday,
      icon: <ShoppingCart size={24} />,
      colorClass: "bg-yellow-100 text-yellow-600",
      change: "Chưa có API",
      changeType: "neutral",
    },
    {
      title: "Doanh thu tháng",
      value: `${(stats.revenueMonth / 1000000).toFixed(1)}M`,
      icon: <DollarSign size={24} />,
      colorClass: "bg-purple-100 text-purple-600",
      change: "Chưa có API",
      changeType: "neutral",
    },
  ];

  // 3. Hiển thị Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  // 4. Render Giao diện chính
  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tổng quan hệ thống
      </h1>

      {/* --- GRID THỐNG KÊ (4 Cards) --- */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => stat.path && navigate(stat.path)}
            className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.colorClass}`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : stat.changeType === "warning"
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHI TIẾT TRẠNG THÁI SẢN PHẨM --- */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Trạng thái kho hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
            <div className="text-gray-500 text-sm uppercase font-semibold">
              Đang hoạt động
            </div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {stats.productBreakdown.active || 0}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-yellow-500">
            <div className="text-gray-500 text-sm uppercase font-semibold">
              Chờ duyệt
            </div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {stats.productBreakdown.pending || 0}
            </div>
            {stats.productBreakdown.pending > 0 && (
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                Cần xử lý ngay
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-red-500">
            <div className="text-gray-500 text-sm uppercase font-semibold">
              Vi phạm / Đã khóa
            </div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {(stats.productBreakdown.rejected || 0) +
                (stats.productBreakdown.hidden || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
