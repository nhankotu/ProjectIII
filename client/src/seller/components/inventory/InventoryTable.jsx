import React from "react";
import { Package, AlertCircle, CheckCircle, Info } from "lucide-react";

const InventoryTable = ({ inventory }) => {
  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Badge trạng thái tự động dựa trên tồn kho
  const getStatusBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={12} className="mr-1" /> Hết hàng
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Info size={12} className="mr-1" /> Sắp hết
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle size={12} className="mr-1" /> Đang bán
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Đã bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {inventory && inventory.length > 0 ? (
              inventory.map((item) => (
                <tr
                  key={item.id || item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Sản phẩm */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                        {item.images?.length > 0 ? (
                          <img
                            className="h-full w-full object-cover"
                            src={item.images[0].url}
                            alt={item.name}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {item.sku || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Danh mục */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.category?.name || "Chưa phân loại"}
                  </td>

                  {/* Tồn kho */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.stock}
                  </td>

                  {/* Giá bán */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    {formatCurrency(item.price)}
                  </td>

                  {/* Đã bán - ĐÃ KHÔI PHỤC TẠI ĐÂY */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {item.sales || 0}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.stock)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  Không tìm thấy sản phẩm nào trong kho
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
