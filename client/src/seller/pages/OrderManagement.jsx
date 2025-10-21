import React, { useState, useMemo } from "react";
import { useOrders } from "../hooks/useOrders";
import OrderFilters from "../components/order/OrderFilters";
import OrderTable from "../components/order/OrderTable";
import OrderDetailsModal from "../components/order/OrderDetailsModal";

const OrderManagement = () => {
  const { orders, loading, updateOrderStatus, refetch } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // Simple date filtering (trong thực tế cần xử lý date phức tạp hơn)
      const matchesDate = dateFilter === "all" || true; // Placeholder

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipping: orders.filter((o) => o.status === "shipping").length,
      completed: orders.filter((o) => o.status === "completed").length,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải đơn hàng...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-600">Tổng số: {stats.total} đơn hàng</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
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
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
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

      <OrderTable
        orders={filteredOrders}
        onUpdateStatus={handleUpdateStatus}
        onViewDetails={handleViewDetails}
      />

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
