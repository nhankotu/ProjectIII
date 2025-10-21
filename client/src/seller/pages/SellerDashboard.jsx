// src/seller/pages/SellerDashboard.jsx
import React, { useState, useEffect } from "react";
import StatsCard from "../components/product/StatsCard";

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalProducts: 0,
    conversionRate: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - sau này sẽ thay bằng API thực
      const mockData = {
        todayRevenue: 12500000,
        totalOrders: 156,
        pendingOrders: 12,
        lowStockProducts: 8,
        totalProducts: 45,
        conversionRate: 3.2,
        recentOrders: [
          {
            id: 1,
            customer: "Nguyễn Văn A",
            amount: 450000,
            status: "pending",
            date: "2024-10-01",
          },
          {
            id: 2,
            customer: "Trần Thị B",
            amount: 780000,
            status: "completed",
            date: "2024-10-01",
          },
          {
            id: 3,
            customer: "Lê Văn C",
            amount: 320000,
            status: "shipping",
            date: "2024-10-01",
          },
        ],
        topProducts: [
          { name: "Áo thun nam", sales: 45, revenue: 2250000 },
          { name: "Quần jeans nữ", sales: 32, revenue: 3840000 },
          { name: "Giày thể thao", sales: 28, revenue: 3920000 },
        ],
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Doanh thu hôm nay"
          value={formatCurrency(dashboardData.todayRevenue)}
          icon="💰"
          change="+12% so với hôm qua"
          changeType="positive"
        />

        <StatsCard
          title="Tổng đơn hàng"
          value={dashboardData.totalOrders}
          icon="📦"
          change="5 đơn mới"
          changeType="positive"
        />

        <StatsCard
          title="Đơn chờ xử lý"
          value={dashboardData.pendingOrders}
          icon="⏳"
          change="Cần xử lý ngay"
          changeType="negative"
        />

        <StatsCard
          title="Sản phẩm sắp hết"
          value={dashboardData.lowStockProducts}
          icon="📋"
          change="Cần nhập thêm"
          changeType="negative"
          subtitle={`/${dashboardData.totalProducts} sản phẩm`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h2>
          <div className="space-y-3">
            {dashboardData.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(order.amount)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status === "completed"
                    ? "Hoàn thành"
                    : order.status === "pending"
                    ? "Chờ xử lý"
                    : "Đang giao"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-3">
            {dashboardData.topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.sales} lượt bán
                  </p>
                </div>
                <p className="font-semibold text-green-600">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 transition-colors">
            <div className="text-2xl mb-2">🛍️</div>
            <p className="text-sm">Thêm sản phẩm</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm">Xử lý đơn hàng</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm">Xem báo cáo</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 transition-colors">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm">Tạo khuyến mãi</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
