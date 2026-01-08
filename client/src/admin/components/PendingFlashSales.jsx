import React, { useEffect } from "react";
import { useAdminFlashSales } from "../hooks/useAdminFlashSales";
import { Check, X, Clock, AlertCircle } from "lucide-react";

const PendingFlashSales = () => {
  // Sử dụng Hook
  const {
    flashSales,
    loading,
    fetchPendingFlashSales,
    approveFlashSale,
    rejectFlashSale,
  } = useAdminFlashSales();

  // Gọi API khi component được mount
  useEffect(() => {
    fetchPendingFlashSales();
  }, [fetchPendingFlashSales]);

  // Loading State
  if (loading && flashSales.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>
    );
  }

  // Empty State
  if (!loading && flashSales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
        <div className="p-3 bg-gray-50 rounded-full mb-3">
          <Check size={24} className="text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Tuyệt vời!</h3>
        <p className="text-gray-500">
          Không có yêu cầu Flash Sale nào đang chờ duyệt.
        </p>
      </div>
    );
  }

  // Render List
  return (
    <div className="grid grid-cols-1 gap-6">
      {flashSales.map((sale) => (
        <div
          key={sale._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Header Card */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">
                Shop: {sale.product?.sellerId?.username || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded border">
              <Clock size={16} className="text-orange-500" />
              <span>{new Date(sale.startDate).toLocaleDateString()}</span>
              <span>➜</span>
              <span>{new Date(sale.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Body Card */}
          <div className="p-6 flex flex-col sm:flex-row gap-6">
            <img
              src={
                sale.product?.thumbnail?.url ||
                "https://via.placeholder.com/150"
              }
              alt={sale.product?.name}
              className="w-24 h-24 object-cover rounded-lg border bg-gray-100"
            />

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {sale.product?.name}
              </h3>

              <div className="flex gap-4 mt-3">
                <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                  <span className="text-xs text-red-500 block">Giảm</span>
                  <span className="text-xl font-bold text-red-600">
                    -{sale.discountPercent}%
                  </span>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-500 block">Giá Sale</span>
                  <span className="text-xl font-bold text-gray-900">
                    {sale.salePrice?.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-center border-l pl-6">
              <button
                onClick={() => approveFlashSale(sale._id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full justify-center"
              >
                <Check size={18} /> Duyệt
              </button>
              <button
                onClick={() => rejectFlashSale(sale._id)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 w-full justify-center"
              >
                <X size={18} /> Từ chối
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingFlashSales;
