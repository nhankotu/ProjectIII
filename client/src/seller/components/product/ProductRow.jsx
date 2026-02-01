import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const ProductRow = ({
  product,
  onEdit,
  onUpdateStock,
  onUpdateStatus,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  // State để quản lý việc mở rộng/thu gọn danh sách biến thể
  const [isExpanded, setIsExpanded] = useState(false);

  const isVariable = product.type === "variable";
  const thumbnailUrl =
    product.thumbnail?.url || "https://placehold.co/60x60?text=No+Img";

  // 1. Format Tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // 2. Badge Trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            Đang bán
          </span>
        );
      case "hidden":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            Đã ẩn
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            Bản nháp
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            {status}
          </span>
        );
    }
  };

  // 3. Helper hiển thị tên Option (VD: Màu: Đỏ, Size: L -> "Đỏ / L")
  const renderVariantOptions = (options) => {
    if (!options) return "";
    return Object.values(options).join(" / ");
  };

  // --- Handlers ---
  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`))
      return;
    setIsDeleting(true);
    try {
      await onDelete(product._id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = product.status === "active" ? "hidden" : "active";
    onUpdateStatus(product._id, newStatus);
  };

  const handleStockChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) onUpdateStock(product._id, val);
  };

  return (
    <>
      {/* --- DÒNG CHÍNH (MAIN ROW) --- */}
      <tr
        className={`hover:bg-gray-50 border-b border-gray-100 transition-colors ${isExpanded ? "bg-gray-50" : ""}`}
      >
        {/* CỘT 1: SẢN PHẨM */}
        <td className="px-6 py-4">
          <div className="flex items-center max-w-md">
            <div className="flex-shrink-0 h-12 w-12 relative">
              <img
                className="h-12 w-12 rounded object-cover border border-gray-200"
                src={thumbnailUrl}
                alt={product.name}
              />
              {/* Nút Toggle mở rộng nếu là Variable */}
              {isVariable && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-0.5 shadow-md hover:bg-blue-700 transition-transform hover:scale-110"
                  title="Xem biến thể"
                >
                  {isExpanded ? (
                    <FaChevronUp size={10} />
                  ) : (
                    <FaChevronDown size={10} />
                  )}
                </button>
              )}
            </div>

            <div className="ml-4">
              <Link
                to={`/seller/products/${product._id}`}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline line-clamp-2"
              >
                {product.name}
              </Link>
              <div className="text-xs text-gray-500 mt-0.5">
                {product.category?.name || "Chưa phân loại"}
              </div>
            </div>
          </div>
        </td>

        {/* CỘT 2: GIÁ */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {/* Nếu variable, hiển thị khoảng giá hoặc giá min */}
          {isVariable ? (
            <span className="text-gray-600 italic text-xs">Xem chi tiết</span>
          ) : (
            <div className="font-bold text-gray-900">
              {formatCurrency(product.price)}
            </div>
          )}
        </td>

        {/* CỘT 3: KHO / ĐÃ BÁN */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-10">Kho:</span>
              {isVariable ? (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 border ${
                    isExpanded
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <FaBoxOpen />
                  {isExpanded ? "Thu gọn" : "Chi tiết"}
                </button>
              ) : (
                <input
                  type="number"
                  defaultValue={product.stock}
                  onBlur={handleStockChange}
                  className={`w-16 text-sm border rounded px-1 py-0.5 text-center outline-none focus:ring-1 focus:ring-blue-500 ${
                    product.stock <= 5
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-gray-300"
                  }`}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-10">Đã bán:</span>
              <span className="text-xs font-semibold text-gray-700">
                {product.sold || 0}
              </span>
            </div>
          </div>
        </td>

        {/* CỘT 4: TRẠNG THÁI */}
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {getStatusBadge(product.status)}
        </td>

        {/* CỘT 5: THAO TÁC */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleToggleStatus}
              className={`p-2 rounded-full ${product.status === "active" ? "text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"}`}
            >
              {product.status === "active" ? <FaEye /> : <FaEyeSlash />}
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 rounded-full hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "..." : <FaTrash size={16} />}
            </button>
          </div>
        </td>
      </tr>

      {/* --- DÒNG MỞ RỘNG: DANH SÁCH BIẾN THỂ (SUB-TABLE) --- */}
      {isExpanded && isVariable && (
        <tr className="bg-gray-50 animate-fade-in-down">
          <td
            colSpan="5"
            className="px-6 py-4 border-b border-gray-200 shadow-inner"
          >
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
              <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 uppercase flex justify-between items-center">
                <span>
                  📦 Danh sách biến thể ({product.variants?.length || 0})
                </span>
                <span className="text-[10px] font-normal normal-case text-gray-500">
                  * Cập nhật kho nhanh tại đây chưa khả dụng, vui lòng dùng nút
                  Sửa
                </span>
              </div>
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      SKU
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Phân loại (Màu/Size)
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Giá
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                      Tồn kho
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.variants?.map((variant, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-xs text-gray-500 font-mono">
                        {variant.sku}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 font-medium">
                        {/* Hiển thị ảnh nhỏ của variant nếu có */}
                        <div className="flex items-center gap-2">
                          {variant.image?.url && (
                            <img
                              src={variant.image.url}
                              alt=""
                              className="w-6 h-6 rounded object-cover border"
                            />
                          )}
                          {renderVariantOptions(variant.options)}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right text-sm text-gray-600">
                        {formatCurrency(variant.price)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {variant.stock === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600">
                            <FaExclamationTriangle size={10} /> Hết hàng
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              variant.stock <= 5
                                ? "bg-orange-100 text-orange-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {variant.stock}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ProductRow;
