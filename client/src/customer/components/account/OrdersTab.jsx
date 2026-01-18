import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { orderAPI } from "../../services/api"; // 🔥 Import API thật

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // 1. Hàm lấy dữ liệu từ Server
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      // axios interceptor của bạn trả về response.data nên:
      const data = response.data || response;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Hàm xử lý Hủy đơn hàng thật
  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Lý do hủy đơn hàng của bạn là gì?");
    if (reason === null) return; // Nhấn Cancel trong prompt

    try {
      await orderAPI.cancelOrder(orderId, reason);
      alert("Đã gửi yêu cầu hủy đơn hàng!");
      fetchOrders(); // Tải lại danh sách
    } catch (error) {
      alert(error.message || "Không thể hủy đơn hàng");
    }
  };

  // Cấu hình các bộ lọc dựa trên dữ liệu thật
  const statusFilters = [
    { id: "all", label: "Tất cả", count: orders.length },
    {
      id: "pending",
      label: "Chờ xác nhận",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      id: "confirmed", // ✨ Thêm bộ lọc Đã xác nhận
      label: "Đã xác nhận",
      count: orders.filter((o) => o.status === "confirmed").length,
    },
    {
      id: "shipping",
      label: "Đang giao",
      count: orders.filter((o) => o.status === "shipping").length,
    },
    {
      id: "delivered",
      label: "Đã giao",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      id: "cancelled",
      label: "Đã hủy",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Chờ xác nhận",
      },
      confirmed: {
        color: "bg-indigo-100 text-indigo-800", // ✨ Màu tím xanh cho sự tin cậy
        label: "Đã xác nhận",
      },
      shipping: { color: "bg-blue-100 text-blue-800", label: "Đang giao" },
      delivered: { color: "bg-green-100 text-green-800", label: "Đã giao" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading)
    return (
      <div className="py-10">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === filter.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-gray-500">
            Bạn chưa có đơn hàng nào trong mục này.
          </p>
          <Link
            to="/products"
            className="inline-block mt-4 text-blue-600 font-medium"
          >
            Mua sắm ngay →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 text-sm">
                    #{order._id?.slice(-8).toUpperCase()}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <span className="text-gray-500 text-xs">
                  Ngày đặt:{" "}
                  {new Date(order.createdAt || order.date).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
              </div>

              {/* Items */}
              <div className="p-4 divide-y divide-gray-100">
                {(order.items || order.itemsDetails || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center py-3 first:pt-0 last:pb-0"
                  >
                    <img
                      src={
                        // 1. Ưu tiên Snapshot URL (String) lưu trực tiếp trong đơn hàng
                        item.thumbnail ||
                        // 2. Dự phòng lấy từ object product nếu có populate
                        item.product?.thumbnail?.url ||
                        item.product?.thumbnail ||
                        // 3. Ảnh mặc định nếu cả 2 trên đều trống
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border"
                      // Thêm xử lý lỗi nếu URL ảnh bị chết (404)
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=Error";
                      }}
                    />
                    <div className="ml-4 flex-grow">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product?.name || item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex gap-2">
                <Link
                  to={`/account/orders/${order._id || order.id}`}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Chi tiết
                </Link>

                {/* ✨ CHỈ cho phép hủy khi đang ở trạng thái pending */}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id || order.id)}
                    className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Hủy đơn
                  </button>
                )}

                {/* Hiển thị nút liên hệ nếu đã xác nhận hoặc đang giao */}
                {(order.status === "confirmed" ||
                  order.status === "shipping") && (
                  <button className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    Liên hệ Shop
                  </button>
                )}

                {order.status === "delivered" && (
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
