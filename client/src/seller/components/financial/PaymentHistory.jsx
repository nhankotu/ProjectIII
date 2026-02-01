import React from "react";
import {
  CreditCard,
  Calendar,
  User,
  ArrowUpRight,
  FileText,
} from "lucide-react";

const PaymentHistory = ({ payments }) => {
  // 1. Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // 2. Badge trạng thái (Backend trả về: 'completed', 'pending')
  const getStatusBadge = (status) => {
    // Chuẩn hóa về chữ thường để so sánh
    const s = status?.toLowerCase() || "pending";

    const config = {
      completed: {
        color: "bg-green-100 text-green-700 border-green-200",
        text: "Thành công",
      },
      paid: {
        color: "bg-green-100 text-green-700 border-green-200",
        text: "Đã thanh toán",
      },
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        text: "Chờ xử lý",
      },
      failed: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "Thất bại",
      },
      cancelled: {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        text: "Đã hủy",
      },
    };

    const { color, text } = config[s] || config.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${color}`}
      >
        {text}
      </span>
    );
  };

  // 3. Map tên phương thức (Backend trả về UpperCase: COD, MOMO...)
  const getMethodText = (method) => {
    const map = {
      COD: "Thanh toán khi nhận hàng",
      MOMO: "Ví MoMo",
      VNPAY: "VNPay",
      BANKING: "Chuyển khoản",
      CARD: "Thẻ tín dụng",
    };
    return map[method?.toUpperCase()] || method || "Khác";
  };

  return (
    <div className="bg-white">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã giao dịch
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Khách hàng
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số tiền
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phương thức
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thời gian
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {/* Cột 1: Mã GD */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-blue-600 font-mono">
                          {payment.id}
                        </span>
                        <span className="text-xs text-gray-400">
                          Đơn: {payment.orderId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Cột 2: Khách hàng */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <User size={16} />
                      </div>
                      <div
                        className="text-sm font-medium text-gray-900 max-w-[150px] truncate"
                        title={payment.customer}
                      >
                        {payment.customer}
                      </div>
                    </div>
                  </td>

                  {/* Cột 3: Số tiền */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>

                  {/* Cột 4: Phương thức */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <CreditCard size={16} className="mr-2 text-gray-400" />
                      {getMethodText(payment.method)}
                    </div>
                  </td>

                  {/* Cột 5: Thời gian */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {/* Backend đã trả về string format sẵn, hiển thị trực tiếp */}
                      {payment.date}
                    </div>
                  </td>

                  {/* Cột 6: Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Chưa có giao dịch nào được ghi nhận
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer link */}
      {payments.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors">
            Xem tất cả giao dịch <ArrowUpRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
