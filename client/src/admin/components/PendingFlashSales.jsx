import React, { useEffect } from "react";
import { useAdminFlashSales } from "../hooks/useAdminFlashSales";
import { Check, X, Clock, Package, Store } from "lucide-react";

const PendingFlashSales = () => {
  const {
    flashSales, // Bây giờ là mảng phẳng các Request sản phẩm
    loading,
    fetchPendingFlashSales,
    approveFlashSale,
    rejectFlashSale,
  } = useAdminFlashSales();

  useEffect(() => {
    fetchPendingFlashSales();
  }, [fetchPendingFlashSales]);

  // ✅ Hàm Helper xử lý ảnh an toàn
  const getImageUrl = (url) => {
    return url || "https://via.placeholder.com/150";
  };

  if (loading && flashSales.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-medium">
          Đang tải danh sách yêu cầu...
        </p>
      </div>
    );
  }

  if (!loading && flashSales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <div className="p-4 bg-green-50 rounded-full mb-4">
          <Check size={32} className="text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Sạch bóng yêu cầu!</h3>
        <p className="text-gray-500">
          Hiện tại không có sản phẩm nào chờ bạn phê duyệt.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Sản phẩm & Người bán</th>
            <th className="px-6 py-4">Chương trình / Khung giờ</th>
            <th className="px-6 py-4 text-right">Giá (Gốc ➜ Sale)</th>
            <th className="px-6 py-4 text-center">Tồn kho / Đăng ký</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {flashSales.map((item) => {
            const discountPercent = Math.round(
              ((item.originalPrice - item.salePrice) / item.originalPrice) *
                100,
            );

            return (
              <tr
                key={item.requestId}
                className="hover:bg-blue-50/30 transition-colors"
              >
                {/* 1. Cột Sản phẩm & Shop */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.productImage || "https://via.placeholder.com/150"
                      } // 🔥 Dùng trực tiếp productImage từ API
                      alt=""
                      className="w-14 h-14 object-cover rounded-lg border bg-white shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-gray-900 line-clamp-1 mb-1">
                        {item.productName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md w-fit">
                        <Store size={12} />
                        {item.seller?.name || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Cột Chương trình */}
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-800 mb-1">
                    {item.flashSaleTitle}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 italic">
                    <Clock size={12} />
                    {new Date(item.startTime).getHours()}h -{" "}
                    {new Date(item.endTime).getHours()}h (
                    {new Date(item.startTime).toLocaleDateString("vi-VN")})
                  </div>
                </td>

                {/* 3. Cột Giá */}
                <td className="px-6 py-4 text-right">
                  <div className="text-xs text-gray-400 line-through mb-0.5">
                    {item.originalPrice?.toLocaleString()}đ
                  </div>
                  <div className="text-sm font-black text-red-600 flex items-center justify-end gap-2">
                    {item.salePrice?.toLocaleString()}đ
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                      -{discountPercent}%
                    </span>
                  </div>
                </td>

                {/* 4. Cột Số lượng */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm font-bold text-gray-800">
                    {item.limitQuantity}
                  </div>
                  <div
                    className={`text-[10px] font-medium ${item.currentStock < item.limitQuantity ? "text-red-500" : "text-gray-400"}`}
                  >
                    Kho thực: {item.currentStock}
                  </div>
                </td>

                {/* 5. Cột Thao tác */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        approveFlashSale(item.flashSaleId, item.requestId)
                      }
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="Chấp nhận"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() =>
                        rejectFlashSale(item.flashSaleId, item.requestId)
                      }
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="Từ chối"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingFlashSales;
