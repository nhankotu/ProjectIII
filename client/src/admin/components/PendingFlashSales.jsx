import React, { useEffect } from "react";
import { useAdminFlashSales } from "../hooks/useAdminFlashSales";
import { Check, X, Clock, Package } from "lucide-react"; // Thêm icon Package

const PendingFlashSales = () => {
  const {
    flashSales,
    loading,
    fetchPendingFlashSales,
    approveFlashSale,
    rejectFlashSale,
  } = useAdminFlashSales();

  useEffect(() => {
    fetchPendingFlashSales();
  }, [fetchPendingFlashSales]);

  // ✅ Hàm Helper xử lý ảnh an toàn (Fix lỗi ảnh)
  const getImageUrl = (product) => {
    if (!product) return "https://via.placeholder.com/150";

    // Ưu tiên 1: Thumbnail là object (Cloudinary)
    if (product.thumbnail && product.thumbnail.url)
      return product.thumbnail.url;

    // Ưu tiên 2: Thumbnail là string (URL trực tiếp)
    if (typeof product.thumbnail === "string") return product.thumbnail;

    // Ưu tiên 3: Lấy từ mảng images
    if (product.images && product.images.length > 0) {
      return product.images[0].url || product.images[0];
    }

    return "https://via.placeholder.com/150";
  };

  if (loading && flashSales.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>
    );
  }

  if (!loading && flashSales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
        <div className="p-3 bg-gray-50 rounded-full mb-3">
          <Check size={24} className="text-green-500" />
        </div>
        <p className="text-gray-500">
          Không có yêu cầu Flash Sale nào đang chờ duyệt.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {flashSales.map((sale) => (
        <div
          key={sale._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* --- Header Chiến dịch --- */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b gap-4">
            <div>
              <h3 className="font-bold text-lg text-blue-900">{sale.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="font-semibold text-gray-800 bg-white px-2 py-0.5 border rounded">
                  Shop:{" "}
                  {sale.createdBy?.username ||
                    sale.createdBy?.shopName ||
                    "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-orange-500" />
                  {new Date(sale.startTime).toLocaleString("vi-VN")} ➜{" "}
                  {new Date(sale.endTime).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>

            {/* Actions duyệt cả chiến dịch */}
            <div className="flex gap-2">
              <button
                onClick={() => approveFlashSale(sale._id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium"
              >
                <Check size={16} /> Duyệt
              </button>
              <button
                onClick={() => rejectFlashSale(sale._id)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm border border-red-200 rounded-lg hover:bg-red-50 font-medium"
              >
                <X size={16} /> Từ chối
              </button>
            </div>
          </div>

          {/* --- Danh sách sản phẩm trong chiến dịch (Sửa lại logic render) --- */}
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-3">Sản phẩm</th>
                  <th className="px-6 py-3">Giá gốc</th>
                  <th className="px-6 py-3">Giá Sale</th>
                  <th className="px-6 py-3">Giảm</th>
                  <th className="px-6 py-3">Số lượng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Kiểm tra mảng products có tồn tại không để tránh lỗi */}
                {sale.products && sale.products.length > 0 ? (
                  sale.products.map((item, idx) => {
                    const product = item.product;
                    if (!product) return null; // Bỏ qua nếu SP bị null

                    const discountPercent = Math.round(
                      ((product.price - item.salePrice) / product.price) * 100
                    );

                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* ✅ Gọi hàm getImageUrl ở đây */}
                            <img
                              src={getImageUrl(product)}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded border bg-white"
                            />
                            <span
                              className="font-medium text-gray-900 line-clamp-2 max-w-[200px]"
                              title={product.name}
                            >
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 line-through">
                          {product.price?.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {item.salePrice?.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            -{discountPercent}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.limitQuantity}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500 italic"
                    >
                      <div className="flex flex-col items-center">
                        <Package size={24} className="mb-2 opacity-50" />
                        Dữ liệu sản phẩm bị lỗi hoặc rỗng
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingFlashSales;
