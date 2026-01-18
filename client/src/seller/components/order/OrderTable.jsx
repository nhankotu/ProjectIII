import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActions from "./OrderActions";

const OrderTable = ({ orders, onUpdateStatus, onViewDetails }) => {
  const formatCurrency = (amount) => {
    // Thêm check amount để tránh lỗi nếu total bị undefined
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getPaymentMethodText = (method) => {
    if (!method) return "Chưa chọn";
    const methods = {
      cod: "COD",
      COD: "COD",
      momo: "Ví MoMo",
      MOMO: "Ví MoMo",
      banking: "Chuyển khoản",
      BANKING: "Chuyển khoản",
      card: "Thẻ tín dụng",
    };
    return methods[method] || method;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              // Dùng order._id nếu order.id bị undefined
              <tr key={order._id || order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {/* Hiển thị orderCode nếu có, không thì dùng ID rút gọn */}
                    {order.orderCode ||
                      (order._id || order.id)?.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items?.length || 0} sản phẩm
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {/* FIX LỖI Ở ĐÂY: Dùng ?. và fallback text */}
                    {order.customer?.name ||
                      order.shippingAddress?.fullName ||
                      "Khách hàng ẩn danh"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.phone ||
                      order.shippingAddress?.phone ||
                      "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* Model của bạn dùng totalAmount, hãy kiểm tra lại prop này */}
                  {formatCurrency(order.totalAmount || order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getPaymentMethodText(order.paymentMethod)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    <OrderActions
                      order={order}
                      onUpdateStatus={onUpdateStatus}
                    />
                    <button
                      onClick={() => onViewDetails(order)}
                      className="text-blue-600 hover:text-blue-900 text-sm text-left"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy đơn hàng nào
        </div>
      )}
    </div>
  );
};

export default OrderTable;
