import React, { useState } from "react";
import ProductStatusBadge from "./ProductStatusBadge";

const ProductRow = ({
  product,
  onEdit,
  onUpdateStock,
  onUpdateStatus,
  onDelete, // ← Thêm prop này
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await onDelete(product.id);
    setIsDeleting(false);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url || product.images[0];
    }
    return "https://via.placeholder.com/60?text=No+Image";
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded object-cover"
            src={getProductImage()}
            alt={product.name}
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="number"
          value={product.stock}
          onChange={(e) =>
            onUpdateStock(product.id, parseInt(e.target.value) || 0)
          }
          className="w-20 p-1 border border-gray-300 rounded text-sm"
          min="0"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.sales || 0}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            📷 {(product.images || []).length}
          </span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            🎥 {(product.videos || []).length}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ProductStatusBadge status={product.status} stock={product.stock} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-900"
            title="Sửa sản phẩm"
          >
            Sửa
          </button>
          <button
            onClick={() =>
              onUpdateStatus(
                product.id,
                product.status === "active" ? "inactive" : "active"
              )
            }
            className="text-green-600 hover:text-green-900"
            title={
              product.status === "active" ? "Ẩn sản phẩm" : "Hiện sản phẩm"
            }
          >
            {product.status === "active" ? "Ẩn" : "Hiện"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-red-600 hover:text-red-900 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Xóa sản phẩm"
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
