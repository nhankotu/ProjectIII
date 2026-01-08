import React, { useState } from "react";
import ProductStatusBadge from "./ProductStatusBadge";

const ProductRow = ({
  product,
  onEdit,
  onUpdateStock,
  onUpdateStatus,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await onDelete(product._id || product.id);
      if (result.success) {
        // alert(result.message); // Thường thì cha sẽ reload lại list, ko cần alert ở đây nếu UI update tốt
      } else {
        alert(result.message || "Có lỗi xảy ra khi xóa sản phẩm");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setIsDeleting(false);
    }
  };

  // Tạo placeholder image local
  const createPlaceholderSVG = (text = "No Image") => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="10" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `)}`;
  };

  // Lấy URL hình ảnh an toàn
  const getSafeImageUrl = () => {
    // Ưu tiên 1: Thumbnail (nếu là string URL)
    if (typeof product.thumbnail === "string" && product.thumbnail) {
      return product.thumbnail;
    }
    // Ưu tiên 2: Thumbnail (nếu là object từ code cũ - phòng hờ)
    if (product.thumbnail && product.thumbnail.url) {
      return product.thumbnail.url;
    }

    // Ưu tiên 3: Images array
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === "string") return firstImage;
      if (firstImage.url) return firstImage.url;
    }

    return createPlaceholderSVG();
  };

  // Xử lý lỗi khi load ảnh
  const handleImageError = (e) => {
    e.target.src = createPlaceholderSVG("Error");
  };

  // Format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // Xử lý cập nhật stock
  const handleStockUpdate = (e) => {
    const newStock = parseInt(e.target.value) || 0;
    if (onUpdateStock) {
      onUpdateStock(product._id || product.id, newStock);
    }
  };

  // Xử lý cập nhật status
  const handleStatusUpdate = () => {
    if (onUpdateStatus) {
      // Kiểm tra status hiện tại để toggle
      // Logic mới: active <-> pending/hidden. Hoặc đơn giản toggle active/inactive
      // Ở đây giả sử toggle active và hidden
      const newStatus = product.isActive ? "hidden" : "active";
      // Lưu ý: Backend controller updateSellerProduct đang dùng isActive/status,
      // bạn cần chắc chắn hàm onUpdateStatus ở cha gửi đúng payload
      onUpdateStatus(product._id || product.id, newStatus);
    }
  };

  // Xử lý edit
  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  const imageUrl = getSafeImageUrl();
  const imagesCount = product.images ? product.images.length : 0;
  // product.video bây giờ là object hoặc array tùy model, check kỹ length
  const videosCount = Array.isArray(product.videos)
    ? product.videos.length
    : product.video
    ? 1
    : 0;

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded object-cover border border-gray-300"
              src={imageUrl}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          <div className="ml-4">
            <div
              className="text-sm font-medium text-gray-900 line-clamp-1"
              title={product.name}
            >
              {product.name}
            </div>
            <div className="text-sm text-gray-500 flex gap-1">
              {/* 🛠️ SỬA LỖI OBJECT: Thêm ?.name */}
              <span>{product.category?.name || "Chưa phân loại"}</span>

              {/* Hiển thị thêm Brand nếu có */}
              {product.brand?.name && (
                <>
                  <span>•</span>
                  <span className="text-gray-400">{product.brand.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatPrice(product.price)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="number"
          value={product.stock || 0}
          onChange={handleStockUpdate}
          className="w-20 p-1 border border-gray-300 rounded text-sm text-center focus:ring-blue-500 focus:border-blue-500"
          min="0"
          disabled={!onUpdateStock}
        />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
        {/* 🛠️ SỬA: Model mới dùng trường 'sold', không phải 'sales' */}
        {product.sold || 0}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center space-x-1">
          {imagesCount > 0 && (
            <span
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-default"
              title={`${imagesCount} hình ảnh`}
            >
              📷 {imagesCount}
            </span>
          )}
          {videosCount > 0 && (
            <span
              className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded cursor-default"
              title={`${videosCount} video`}
            >
              🎥 {videosCount}
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {/* Truyền cả isActive để badge hiển thị đúng */}
        <ProductStatusBadge
          status={product.status}
          isActive={product.isActive}
          stock={product.stock}
        />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          {/* Nút Sửa */}
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
            title="Sửa sản phẩm"
            disabled={!onEdit}
          >
            ✏️
          </button>

          {/* Nút Ẩn/Hiện */}
          <button
            onClick={handleStatusUpdate}
            className={`transition-colors duration-200 ${
              product.isActive
                ? "text-orange-600 hover:text-orange-900"
                : "text-green-600 hover:text-green-900"
            }`}
            title={product.isActive ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
            disabled={!onUpdateStatus}
          >
            {product.isActive ? "👁️" : "Unhide"}
          </button>

          {/* Nút Xóa */}
          <button
            onClick={handleDelete}
            disabled={isDeleting || !onDelete}
            className={`transition-colors duration-200 ${
              isDeleting
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-900"
            }`}
            title="Xóa sản phẩm"
          >
            {isDeleting ? "⏳" : "🗑️"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
