import React from "react";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddProduct,
  totalProducts,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Khu vực Tìm kiếm & Filter */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
          {/* Input Tìm kiếm */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Dropdown Filter Status */}
          <div className="w-full md:w-56 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" size={14} />
            </div>
            <select
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán (Active)</option>
              <option value="hidden">Đã ẩn (Hidden)</option>
              <option value="draft">Bản nháp (Draft)</option>
              {/* Giữ lại 2 logic lọc kho này vì ProductTable đã xử lý */}
              <option value="out_of_stock">⚠️ Hết hàng</option>
              <option value="low_stock">⚠️ Sắp hết hàng (≤10)</option>
            </select>
            {/* Mũi tên custom cho select */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Nút Thêm Mới */}
        <button
          onClick={onAddProduct}
          className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-sm font-medium"
        >
          <FaPlus size={14} />
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
