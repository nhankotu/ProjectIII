import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: "ORD-2024-00123",
          date: "2024-01-15",
          status: "delivered",
          items: 3,
          total: 2450000,
          trackingNumber: "TRK123456789",
          deliveryDate: "2024-01-18",
          itemsDetails: [
            { name: "Wireless Headphones", quantity: 1, price: 850000 },
            { name: "Phone Case", quantity: 2, price: 300000 },
          ],
        },
        {
          id: "ORD-2024-00124",
          date: "2024-01-20",
          status: "shipped",
          items: 2,
          total: 1750000,
          trackingNumber: "TRK987654321",
          estimatedDelivery: "2024-01-25",
          itemsDetails: [
            { name: "Smart Watch", quantity: 1, price: 1200000 },
            { name: "Screen Protector", quantity: 1, price: 550000 },
          ],
        },
        {
          id: "ORD-2024-00125",
          date: "2024-01-22",
          status: "processing",
          items: 1,
          total: 890000,
          itemsDetails: [
            { name: "Bluetooth Speaker", quantity: 1, price: 890000 },
          ],
        },
        {
          id: "ORD-2024-00126",
          date: "2024-01-10",
          status: "cancelled",
          items: 2,
          total: 450000,
          itemsDetails: [{ name: "USB Cable", quantity: 2, price: 225000 }],
        },
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const statusFilters = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "processing",
      label: "Processing",
      count: orders.filter((o) => o.status === "processing").length,
    },
    {
      id: "shipped",
      label: "Shipped",
      count: orders.filter((o) => o.status === "shipped").length,
    },
    {
      id: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
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
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Processing",
      },
      shipped: { color: "bg-blue-100 text-blue-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: "Unknown",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusFilters.slice(1).map((filter) => (
          <div
            key={filter.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-gray-900">
              {filter.count}
            </div>
            <div className="text-sm text-gray-600 mt-1">{filter.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeFilter === filter.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">You haven't placed any orders yet</p>
          <Link
            to="/products"
            className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Placed on{" "}
                      {new Date(order.date).toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {order.items} item{order.items !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-semibold mb-4">Items in this order</h4>
                <div className="space-y-4">
                  {order.itemsDetails.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4"></div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    {order.trackingNumber && (
                      <p className="text-gray-600">
                        Tracking:{" "}
                        <span className="font-medium">
                          {order.trackingNumber}
                        </span>
                      </p>
                    )}
                    {order.deliveryDate && (
                      <p className="text-gray-600 text-sm">
                        Delivered on{" "}
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    )}
                    {order.estimatedDelivery && (
                      <p className="text-gray-600 text-sm">
                        Estimated delivery:{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>

                    {order.status === "delivered" && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Leave Review
                      </button>
                    )}

                    {order.status === "processing" && (
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Cancel Order
                      </button>
                    )}

                    {order.status === "shipped" && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              ← Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Next →
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
