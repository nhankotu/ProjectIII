import React, { useEffect, useState } from "react";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { Eye, Check, X, Ban, Trash2 } from "lucide-react";

const ProductsPage = () => {
  const { products, loading, fetchProducts, updateStatus, deleteProduct } =
    useAdminProducts();
  const [filter, setFilter] = useState("pending"); // Mặc định xem hàng chờ duyệt

  useEffect(() => {
    fetchProducts({ status: filter });
  }, [filter, fetchProducts]);

  const handleAction = async (id, action) => {
    let success = false;
    if (action === "approve") success = await updateStatus(id, "active");
    if (action === "reject")
      success = await updateStatus(id, "rejected", "Vi phạm chính sách");
    if (action === "ban")
      success = await updateStatus(id, "hidden", "Khóa bởi Admin");
    if (action === "delete") success = await deleteProduct(id);

    if (success) fetchProducts({ status: filter });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <select
          className="border rounded-lg px-3 py-2 bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="pending">Chờ duyệt</option>
          <option value="active">Đang bán</option>
          <option value="rejected">Đã từ chối</option>
          <option value="hidden">Đã ẩn/Khóa</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Shop</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex gap-3">
                  <img
                    src={p.thumbnail?.url}
                    className="w-12 h-12 rounded object-cover bg-gray-100"
                  />
                  <div>
                    <div className="font-medium line-clamp-1">{p.name}</div>
                    <div className="text-xs text-gray-500">Kho: {p.stock}</div>
                  </div>
                </td>
                <td className="p-4 font-medium">{p.price.toLocaleString()}đ</td>
                <td className="p-4 text-sm text-gray-600">
                  {p.sellerId?.username}
                </td>
                <td className="p-4 text-right space-x-2">
                  {/* Logic nút bấm dựa trên filter */}
                  {filter === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(p._id, "approve")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Duyệt"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleAction(p._id, "reject")}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Từ chối"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                  {filter === "active" && (
                    <button
                      onClick={() => handleAction(p._id, "ban")}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                      title="Khóa"
                    >
                      <Ban size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(p._id, "delete")}
                    className="p-2 text-gray-400 hover:text-red-600 rounded"
                    title="Xóa mềm"
                  >
                    <Trash2 size={18} />
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

export default ProductsPage;
