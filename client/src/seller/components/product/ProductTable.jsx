import React from "react";
import ProductRow from "./ProductRow";

const ProductTable = ({
  products,
  onEditProduct,
  onUpdateStock,
  onUpdateStatus,
  onDeleteProduct,
  searchTerm,
  statusFilter,
}) => {
  const filteredProducts = products.filter((product) => {
    // 1. Search (An toàn hơn với optional chaining)
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 2. Filter Status & Stock
    let matchesStatus = true;
    if (statusFilter !== "all") {
      if (statusFilter === "out_of_stock") {
        // Lưu ý: Sản phẩm biến thể (variable) có stock=0 ở root,
        // logic này sẽ coi chúng là hết hàng.
        // Nếu muốn ẩn biến thể khỏi bộ lọc này, thêm: && product.type === 'simple'
        matchesStatus = product.stock === 0;
      } else if (statusFilter === "low_stock") {
        matchesStatus = product.stock > 0 && product.stock <= 10;
      } else {
        matchesStatus = product.status === statusFilter;
      }
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Gộp Ảnh + Tên + Danh mục vào cột đầu tiên (Rộng nhất) */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Sản phẩm
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kho / Đã bán
              </th>

              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <ProductRow
                key={product._id} // ✅ QUAN TRỌNG: Sửa thành _id
                product={product}
                onEdit={onEditProduct}
                onUpdateStock={onUpdateStock}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDeleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg
            className="w-12 h-12 mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
