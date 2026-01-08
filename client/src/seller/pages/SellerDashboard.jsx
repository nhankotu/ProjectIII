// src/seller/pages/SellerDashboard.jsx
import React from "react";
import StatsCard from "../components/product/StatsCard";
import { useSellerDashboard } from "../hooks/useSellerDashboard";

const SellerDashboard = () => {
  const {
    dashboardData,
    loading,
    error,
    refetch,
    formatCurrency,
    formatStatus,
    handleQuickAction,
  } = useSellerDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <div className="text-lg text-gray-600">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-500 text-xl mb-4">⚠️ Lỗi tải dữ liệu</div>
        <p className="text-gray-600 mb-4 text-center px-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard Người bán
            </h1>
            <p className="text-gray-600 mt-2">Tổng quan hoạt động kinh doanh</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatsCard
          title="Doanh thu hôm nay"
          value={formatCurrency(dashboardData.todayRevenue)}
          icon="💰"
          change={
            dashboardData.todayRevenue > 0
              ? "+12% so với hôm qua"
              : "Chưa có doanh thu"
          }
          changeType={dashboardData.todayRevenue > 0 ? "positive" : "neutral"}
        />

        <StatsCard
          title="Tổng đơn hàng"
          value={dashboardData.totalOrders}
          icon="📦"
          change={`${dashboardData.recentOrders.length} đơn gần đây`}
          changeType={dashboardData.totalOrders > 0 ? "positive" : "neutral"}
        />

        <StatsCard
          title="Đơn chờ xử lý"
          value={dashboardData.pendingOrders}
          icon="⏳"
          change={
            dashboardData.pendingOrders > 0
              ? "Cần xử lý ngay"
              : "Tất cả đã xử lý"
          }
          changeType={dashboardData.pendingOrders > 0 ? "negative" : "positive"}
        />

        <StatsCard
          title="Sản phẩm sắp hết"
          value={dashboardData.lowStockProducts}
          icon="📋"
          change={
            dashboardData.lowStockProducts > 0 ? "Cần nhập thêm" : "Đủ hàng"
          }
          changeType={
            dashboardData.lowStockProducts > 0 ? "negative" : "positive"
          }
          subtitle={`/${dashboardData.totalProducts} sản phẩm`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Đơn hàng gần đây
            </h2>
            {dashboardData.recentOrders.length > 0 && (
              <button
                onClick={() => handleQuickAction("process-orders")}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Xem tất cả →
              </button>
            )}
          </div>

          {dashboardData.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-3xl mb-2">📭</div>
              <p className="text-gray-500">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.recentOrders.map((order, index) => {
                const status = formatStatus(order.status);
                return (
                  <div
                    key={order.id || index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {order.customer}
                      </p>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-600">
                          {formatCurrency(order.amount)}
                        </p>
                        <span className="mx-2 text-gray-300">•</span>
                        <p className="text-sm text-gray-500">
                          {order.date || new Date().toLocaleDateString("vi-VN")}
                        </p>
                        {order.itemsCount > 0 && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {order.itemsCount} sản phẩm
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Sản phẩm bán chạy
            </h2>
            {dashboardData.topProducts.length > 0 && (
              <button
                onClick={() => handleQuickAction("add-product")}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Quản lý sản phẩm →
              </button>
            )}
          </div>

          {dashboardData.topProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-3xl mb-2">📦</div>
              <p className="text-gray-500">Chưa có sản phẩm bán chạy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.topProducts.map((product, index) => (
                <div
                  key={product.id || index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    {/* Product Image */}
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} lượt bán
                        {product.stock > 0 && (
                          <span className="ml-2">
                            • Còn {product.stock} sản phẩm
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 whitespace-nowrap">
                      {formatCurrency(product.revenue)}
                    </p>
                    {product.price > 0 && (
                      <p className="text-xs text-gray-500">
                        {formatCurrency(product.price)}/sản phẩm
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <button
            onClick={() => handleQuickAction("add-product")}
            className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-green-500 hover:bg-green-50 transition-all duration-200"
          >
            <div className="text-2xl mb-2">🛍️</div>
            <p className="text-sm font-medium">Thêm sản phẩm</p>
          </button>

          <button
            onClick={() => handleQuickAction("process-orders")}
            className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-green-500 hover:bg-green-50 transition-all duration-200"
          >
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm font-medium">Xử lý đơn hàng</p>
          </button>

          <button
            onClick={() => handleQuickAction("view-reports")}
            className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-green-500 hover:bg-green-50 transition-all duration-200"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium">Xem báo cáo</p>
          </button>

          <button
            onClick={() => handleQuickAction("create-promotion")}
            className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-green-500 hover:bg-green-50 transition-all duration-200"
          >
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium">Tạo khuyến mãi</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
