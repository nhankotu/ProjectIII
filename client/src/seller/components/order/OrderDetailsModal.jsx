import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng (COD)",
      momo: "Ví MoMo",
      banking: "Chuyển khoản ngân hàng",
      card: "Thẻ tín dụng",
    };
    return methods[method] || method;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
              <p className="text-gray-600">{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin đơn hàng */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Thông tin đơn hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Trạng thái:</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày đặt:</span>
                    <span>
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cập nhật:</span>
                    <span>
                      {new Date(order.updatedAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phương thức thanh toán:</span>
                    <span>{getPaymentMethodText(order.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Thông tin khách hàng</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Họ tên:</strong> {order.customer.name}
                  </div>
                  <div>
                    <strong>SĐT:</strong> {order.customer.phone}
                  </div>
                  <div>
                    <strong>Email:</strong> {order.customer.email}
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Địa chỉ giao hàng</h4>
                <p className="text-sm">{order.shippingAddress}</p>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Sản phẩm</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.product}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ghi chú (có thể thêm sau) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Ghi chú</h4>
                <p className="text-sm text-gray-600">Không có ghi chú</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
