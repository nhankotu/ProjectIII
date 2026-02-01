import React from "react";

const VariantsList = ({ product }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-800 mb-4">Danh sách biến thể</h3>
    {product.type === "simple" ? (
      <div className="p-4 bg-blue-50 rounded-lg text-blue-700 text-sm">
        Sản phẩm này là loại phổ thông. Tồn kho:{" "}
        <strong>{product.stock}</strong>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Biến thể</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Giá</th>
              <th className="px-4 py-2">Kho</th>
            </tr>
          </thead>
          <tbody>
            {product.variants?.map((v, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-700">
                  {Object.values(v.options).join(" - ")}
                </td>
                <td className="px-4 py-3 text-gray-500">{v.sku}</td>
                <td className="px-4 py-3 text-blue-600 font-bold">
                  {v.price.toLocaleString()}đ
                </td>
                <td className="px-4 py-3">{v.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default VariantsList;
