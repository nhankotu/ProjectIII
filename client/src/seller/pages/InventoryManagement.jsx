// components/inventory/InventoryManagement.js
import React, { useState, useMemo } from "react";
import { useInventory } from "../hooks/useInventory";
import InventoryStats from "../components/inventory/InventoryStats";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import { RefreshCcw } from "lucide-react";
const LoadingSpinner = () => (
  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
);

const InventoryManagement = () => {
  const { inventory, loading, error, updateStock, stats, refetch } =
    useInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 2. Lấy danh sách categories thực tế
  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(inventory.map((item) => item.category).filter(Boolean)),
    ];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  const handleUpdateStock = async (productId, newStock) => {
    const result = await updateStock(productId, newStock);
    if (result.success) {
      alert("✅ Cập nhật tồn kho thành công!");
    } else {
      alert(`❌ Lỗi: ${result.error}`);
    }
  };

  // 5. Giao diện Loading
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-gray-50">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Đang tải dữ liệu kho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-red-50 p-6 rounded-lg">
        <div className="text-red-600 text-lg font-medium mb-2">
          Đã xảy ra lỗi tải dữ liệu
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium shadow-sm transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Tồn Kho</h1>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi và cập nhật số lượng sản phẩm
          </p>
        </div>
        <button
          onClick={refetch}
          className="p-2 bg-white border rounded-full hover:bg-gray-100 transition shadow-sm text-gray-600"
          title="Tải lại dữ liệu"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <InventoryStats stats={stats} />

      {/* Filters & Tools */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <InventoryFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          categories={categories}
          onSearchChange={setSearchTerm}
          onCategoryFilterChange={setCategoryFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-gray-500 text-lg">
              {inventory.length === 0
                ? "Kho hàng đang trống"
                : "Không tìm thấy sản phẩm phù hợp"}
            </div>
            {inventory.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            <InventoryTable
              inventory={filteredInventory}
              onUpdateStock={handleUpdateStock}
            />

            {/* Footer Summary */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500 flex justify-between">
              <span>Hiển thị {filteredInventory.length} kết quả</span>
              <span>Tổng kho: {inventory.length} sản phẩm</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
