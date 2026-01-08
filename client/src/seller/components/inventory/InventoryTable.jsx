import React, { useState } from "react";

const InventoryTable = ({ inventory, onUpdateStock }) => {
  const [editingStock, setEditingStock] = useState(null);
  const [tempStockValue, setTempStockValue] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status, stock) => {
    const statusConfig = {
      active: { label: "Đang bán", color: "bg-green-100 text-green-800" },
      low_stock: { label: "Sắp hết", color: "bg-yellow-100 text-yellow-800" },
      out_of_stock: { label: "Hết hàng", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || {
      label: "Không xác định",
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleStockEdit = (item) => {
    setEditingStock(item.id);
    setTempStockValue(item.stock.toString());
  };

  const handleStockSave = (itemId) => {
    const newStock = parseInt(tempStockValue) || 0;
    if (newStock >= 0) {
      onUpdateStock(itemId, newStock);
    }
    setEditingStock(null);
    setTempStockValue("");
  };

  const handleStockCancel = () => {
    setEditingStock(null);
    setTempStockValue("");
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
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã bán
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
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* ✅ Sản phẩm */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {item.images && item.images.length > 0 ? (
                      <img
                        className="h-10 w-10 rounded object-cover"
                        src={item.images[0].url}
                        alt={item.name}
                      />
                    ) : (
                      <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">{item.sku}</div>
                    </div>
                  </div>
                </td>

                {/* ✅ Danh mục - ĐÃ SỬA LỖI TẠI ĐÂY */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category?.name || "Chưa phân loại"}
                </td>

                {/* ✅ Tồn kho với chức năng edit */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStock === item.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={tempStockValue}
                        onChange={(e) => setTempStockValue(e.target.value)}
                        className="w-20 p-1 border border-gray-300 rounded text-sm"
                        min="0"
                        autoFocus
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStockSave(item.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          ✅
                        </button>
                        <button
                          onClick={handleStockCancel}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center space-x-2 cursor-pointer group"
                      onClick={() => handleStockEdit(item)}
                    >
                      <span className="text-sm font-medium">{item.stock}</span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-600">
                        ✏️
                      </span>
                    </div>
                  )}
                </td>

                {/* ✅ Giá bán */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatCurrency(item.price)}
                </td>

                {/* ✅ Đã bán */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.sales || 0}
                </td>

                {/* ✅ Trạng thái */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item.status, item.stock)}
                </td>

                {/* ✅ Thao tác */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleStockEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Sửa tồn kho
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
