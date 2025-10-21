import React from "react";

const InventoryFilters = ({
  searchTerm,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo SKU, tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Thời trang">Thời trang</option>
              <option value="Giày dép">Giày dép</option>
              <option value="Phụ kiện">Phụ kiện</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="in_stock">Đủ hàng</option>
              <option value="low_stock">Sắp hết</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
          >
            🔄 Làm mới
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap">
            📥 Nhập kho
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
