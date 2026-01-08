// src/components/admin/Products/ProductStats.jsx
import React, { useEffect } from "react";
import { useProducts } from "../../../hooks/admin/useProducts";

const ProductStats = () => {
  const { loading, error, stats, fetchProductStats } = useProducts();

  useEffect(() => {
    fetchProductStats();
  }, [fetchProductStats]);

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm ${
                  change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">
                so với tháng trước
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProductStats}
          className="px-4 py-2 mt-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê Sản phẩm</h2>
        <p className="mt-1 text-gray-600">
          Tổng quan về tình hình sản phẩm trên hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng sản phẩm"
          value={stats?.totalProducts || 0}
          change={stats?.totalProductsChange}
          color="bg-blue-100"
          icon={
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          }
        />

        <StatCard
          title="Chờ duyệt"
          value={stats?.pendingProducts || 0}
          change={stats?.pendingProductsChange}
          color="bg-yellow-100"
          icon={
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Đã duyệt"
          value={stats?.approvedProducts || 0}
          change={stats?.approvedProductsChange}
          color="bg-green-100"
          icon={
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Từ chối"
          value={stats?.rejectedProducts || 0}
          change={stats?.rejectedProductsChange}
          color="bg-red-100"
          icon={
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Phân bố trạng thái
          </h3>
          <div className="space-y-4">
            {stats?.statusDistribution?.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      item.status === "approved"
                        ? "bg-green-500"
                        : item.status === "pending"
                        ? "bg-yellow-500"
                        : item.status === "rejected"
                        ? "bg-red-500"
                        : item.status === "hidden"
                        ? "bg-gray-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600 capitalize">
                    {item.status === "approved"
                      ? "Đã duyệt"
                      : item.status === "pending"
                      ? "Chờ duyệt"
                      : item.status === "rejected"
                      ? "Từ chối"
                      : item.status === "hidden"
                      ? "Ẩn"
                      : item.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Danh mục nhiều sản phẩm nhất
          </h3>
          <div className="space-y-4">
            {stats?.topCategories?.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 mr-3 text-sm font-medium text-gray-500 flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">
                    {category.productCount}
                  </span>
                  <span className="text-sm text-gray-500">sản phẩm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thời gian
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Người thực hiện
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.recentActivities?.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        activity.action === "approve"
                          ? "bg-green-100 text-green-800"
                          : activity.action === "reject"
                          ? "bg-red-100 text-red-800"
                          : activity.action === "create"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.action === "approve"
                        ? "Duyệt"
                        : activity.action === "reject"
                        ? "Từ chối"
                        : activity.action === "create"
                        ? "Tạo mới"
                        : activity.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {activity.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {activity.performedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;
