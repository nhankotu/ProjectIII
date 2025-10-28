import React from "react";

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddProduct,
  totalProducts,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
              <option value="out_of_stock">Hết hàng</option>
              <option value="low_stock">Sắp hết</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
        </div>
        <button
          onClick={onAddProduct}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap"
        >
          + Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
