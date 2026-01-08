import React, { useState, useMemo } from "react";
import { useOrders } from "../hooks/useOrders";
import OrderFilters from "../components/order/OrderFilters";
import OrderTable from "../components/order/OrderTable";
import OrderDetailsModal from "../components/order/OrderDetailsModal";

const OrderManagement = () => {
  // ✅ THÊM sellerId - lấy từ localStorage hoặc context
  const getSellerId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id || user.id;
  };

  const sellerId = getSellerId();

  const { orders, loading, updateOrderStatus, refetch, getOrderCounts } =
    useOrders(sellerId);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ✅ Filter orders với date filtering thực tế
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer?.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // ✅ DATE FILTERING THỰC TẾ
      const matchesDate = (() => {
        if (dateFilter === "all") return true;

        const orderDate = new Date(order.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === today.toDateString();
          case "yesterday":
            return orderDate.toDateString() === yesterday.toDateString();
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // ✅ Xử lý kết quả update status
  const handleUpdateStatus = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      // Có thể thêm toast notification ở đây
      console.log("✅ Cập nhật trạng thái thành công");
    } else {
      console.error("❌ Cập nhật thất bại:", result.error);
    }
  };

  // ✅ Sử dụng getOrderCounts từ hook (nếu có) hoặc tính toán
  const stats = useMemo(() => {
    // Nếu hook đã có getOrderCounts thì dùng cái đó
    if (getOrderCounts) {
      return getOrderCounts();
    }

    // Fallback: tự tính toán
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipping: orders.filter((o) => o.status === "shipping").length,
      delivered: orders.filter((o) => o.status === "delivered").length, // ✅ SỬA "completed" → "delivered"
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders, getOrderCounts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-600">Tổng số: {stats.total} đơn hàng</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Tổng đơn</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Chờ xác nhận</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.confirmed}
            </div>
            <div className="text-sm text-gray-600">Đã xác nhận</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {stats.shipping}
            </div>
            <div className="text-sm text-gray-600">Đang giao</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
            <div className="text-sm text-gray-600">Đã giao</div>{" "}
            {/* ✅ SỬA "Hoàn thành" → "Đã giao" */}
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-gray-600">Đã huỷ</div>
          </div>
        </div>
      </div>

      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onRefresh={refetch}
      />

      {/* ✅ Hiển thị thông báo khi không có orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
          <div className="text-gray-500 text-lg">
            {orders.length === 0
              ? "Chưa có đơn hàng nào"
              : "Không tìm thấy đơn hàng phù hợp"}
          </div>
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onUpdateStatus={handleUpdateStatus}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Order Details Modal */}
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

export default OrderManagement;
