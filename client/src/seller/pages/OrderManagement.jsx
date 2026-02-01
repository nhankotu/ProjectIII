import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import OrderTable from "../components/order/OrderTable";
import OrderDetailsModal from "../components/order/OrderDetailsModal";
import { RefreshCcw, Search, Filter } from "lucide-react";

const OrderManagement = () => {
  // 1. Sử dụng Hook mới (Không cần truyền sellerId nữa)
  const {
    orders,
    pagination,
    filter,
    loading,
    stats,
    updateOrderStatus,
    changePage,
    changeStatus,
    refresh,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Lưu ý: Search Term hiện tại chưa được Backend hỗ trợ trong code trước
  // Nếu muốn Search, bạn cần update Backend thêm regex tìm kiếm.
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      // Có thể thêm Toast notification tại đây
      console.log("Cập nhật thành công");
    } else {
      alert(result.message);
    }
  };

  // Danh sách các tab trạng thái
  const statusTabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "confirmed", label: "Đã xác nhận" },
    { id: "shipping", label: "Đang giao" },
    { id: "delivered", label: "Đã giao" },
    { id: "cancelled", label: "Đã huỷ" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER & STATS SUMMARY */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Đơn Hàng
            </h1>
            <p className="text-gray-500 text-sm">
              Tổng số đơn hàng:{" "}
              <span className="font-bold text-blue-600">
                {pagination.totalDocs}
              </span>
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-2 bg-white border rounded-full hover:bg-gray-100 transition shadow-sm"
            title="Tải lại dữ liệu"
          >
            <RefreshCcw
              size={20}
              className={
                loading ? "animate-spin text-blue-600" : "text-gray-600"
              }
            />
          </button>
        </div>

        {/* STATS CARDS  */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <StatCard
            label="Tổng đơn"
            value={stats.total}
            color="text-blue-600"
          />
          <StatCard
            label="Chờ xác nhận"
            value={stats.pending}
            color="text-yellow-600"
          />
          <StatCard
            label="Đã xác nhận"
            value={stats.confirmed}
            color="text-blue-600"
          />
          <StatCard
            label="Đang giao"
            value={stats.shipping}
            color="text-orange-600"
          />
          <StatCard
            label="Đã giao"
            value={stats.delivered}
            color="text-green-600"
          />
          <StatCard
            label="Đã huỷ"
            value={stats.cancelled}
            color="text-red-600"
          />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4">
        {/* 1. Status Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeStatus(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                filter.status === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2. Search & Tools (Search chưa hoạt động với Backend hiện tại) */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm mã đơn, tên khách hàng... (Cần update BE)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Nút lọc nâng cao (Date) - Tạm ẩn vì BE chưa support */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <Filter size={18} /> <span>Lọc ngày</span>
          </button>
        </div>
      </div>

      {/* TABLE CONTENT */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <div className="text-gray-400 mb-3">📦</div>
          <p className="text-gray-500">
            Không tìm thấy đơn hàng nào ở trang này.
          </p>
        </div>
      ) : (
        <>
          <OrderTable
            orders={orders} // Truyền trực tiếp, không cần filter client
            onUpdateStatus={handleUpdateStatus}
            onViewDetails={handleViewDetails}
          />

          {/* PAGINATION UI */}
          <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">
              Hiển thị trang{" "}
              <span className="font-bold text-gray-800">{pagination.page}</span>{" "}
              trên tổng số{" "}
              <span className="font-bold text-gray-800">
                {pagination.totalPages}
              </span>{" "}
              trang
            </div>

            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => changePage(pagination.page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Trước
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => changePage(pagination.page + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors shadow-sm"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL CHI TIẾT */}
      {showDetailsModal && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);
export default OrderManagement;
