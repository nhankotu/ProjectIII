import React from "react";

const PaymentHistory = ({ payments }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { color: "bg-green-100 text-green-800", text: "Thành công" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ xử lý" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Đã hủy" },
      failed: { color: "bg-gray-100 text-gray-800", text: "Thất bại" },
    };

    const { color, text } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}
      >
        {text}
      </span>
    );
  };

  const getMethodText = (method) => {
    const methods = {
      cod: "COD",
      momo: "Ví MoMo",
      banking: "Chuyển khoản",
      card: "Thẻ tín dụng",
    };
    return methods[method] || method;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">Lịch sử thanh toán</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã thanh toán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phí
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {payment.customer}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {getMethodText(payment.method)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.fee)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(payment.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có giao dịch thanh toán nào
        </div>
      )}

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Hiển thị {payments.length} giao dịch gần nhất</div>
        <button className="text-blue-600 hover:text-blue-800">
          Xem tất cả →
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;
