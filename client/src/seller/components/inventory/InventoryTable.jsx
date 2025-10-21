import React from "react";
import StockAlertBadge from "./StockAlertBadge";

const InventoryTable = ({ inventory, onUpdateStock }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleStockUpdate = (productId, newStock) => {
    if (newStock >= 0) {
      onUpdateStock(productId, parseInt(newStock));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU & Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phân loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá vốn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhà cung cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cập nhật
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                      {item.sku.split("-")[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">{item.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.currentStock}
                      onChange={(e) =>
                        handleStockUpdate(item.id, e.target.value)
                      }
                      className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">
                      /{item.safetyStock}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.costPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                  {formatCurrency(item.salePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockAlertBadge
                    status={item.status}
                    currentStock={item.currentStock}
                    safetyStock={item.safetyStock}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{item.supplier}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(item.lastRestocked)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.daysInStock} ngày
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inventory.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có sản phẩm nào trong kho
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
