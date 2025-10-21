// src/admin/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivities(data.recentActivities || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl text-blue-500">{icon}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng Users" value={stats.totalUsers} icon="👥" />
        <StatCard title="Tổng Sellers" value={stats.totalSellers} icon="🏪" />
        <StatCard title="Tổng Sản phẩm" value={stats.totalProducts} icon="🛍️" />
        <StatCard title="Tổng Đơn hàng" value={stats.totalOrders} icon="📦" />
        <StatCard title="Đơn chờ xử lý" value={stats.pendingOrders} icon="⏳" />
        <StatCard
          title="Doanh thu"
          value={`${stats.revenue.toLocaleString()}đ`}
          icon="💰"
          subtitle="Tháng này"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded"
              >
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Không có hoạt động nào gần đây
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
