import React from "react";

const ProductTable = ({ products, onEdit, onUpdateStock, onUpdateStatus }) => {
  const getStatusBadge = (status, stock) => {
    const actualStatus =
      stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : status;

    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Đang bán" },
      inactive: { color: "bg-gray-100 text-gray-800", text: "Ngừng bán" },
      out_of_stock: { color: "bg-red-100 text-red-800", text: "Hết hàng" },
      low_stock: { color: "bg-yellow-100 text-yellow-800", text: "Sắp hết" },
    };

    const config = statusConfig[actualStatus] || statusConfig.active;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh/Video
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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded object-cover"
                      src={
                        product.images[0] || "https://via.placeholder.com/60"
                      }
                      alt={product.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) =>
                      onUpdateStock(product.id, parseInt(e.target.value))
                    }
                    className="w-20 p-1 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.sales}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    {product.images.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        📷 {product.images.length}
                      </span>
                    )}
                    {product.videos.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        🎥 {product.videos.length}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.status, product.stock)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
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
                    >
                      {product.status === "active" ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy sản phẩm nào
        </div>
      )}
    </div>
  );
};

export default ProductTable;
