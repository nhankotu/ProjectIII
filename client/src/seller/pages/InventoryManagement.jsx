// components/inventory/InventoryManagement.js
import React, { useState, useMemo } from "react";
import { useInventory } from "../hooks/useInventory";
import InventoryStats from "../components/inventory/InventoryStats";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";

const InventoryManagement = () => {
  const { inventory, loading, error, updateStock, getInventoryStats, refetch } =
    useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Lấy danh sách categories thực tế
  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(inventory.map((item) => item.category).filter(Boolean)),
    ];
  }, [inventory]);

  // ✅ Filter inventory thực tế
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

  const stats = getInventoryStats();

  // ✅ Xử lý cập nhật stock
  const handleUpdateStock = async (productId, newStock) => {
    const result = await updateStock(productId, newStock);
    if (result.success) {
      console.log("✅ Cập nhật tồn kho thành công");
      // Có thể thêm toast notification ở đây
    } else {
      console.error("❌ Cập nhật tồn kho thất bại:", result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải tồn kho...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-lg">Lỗi: {error}</div>
        <button
          onClick={refetch}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Tồn Kho</h1>
        <p className="text-gray-600">Theo dõi và quản lý tồn kho sản phẩm</p>
      </div>

      {/* Stats Dashboard */}
      <InventoryStats stats={stats} />

      {/* Filters */}
      <InventoryFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryFilterChange={setCategoryFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={refetch}
      />

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
          <div className="text-gray-500 text-lg">
            {inventory.length === 0
              ? "Chưa có sản phẩm nào trong kho"
              : "Không tìm thấy sản phẩm phù hợp"}
          </div>
        </div>
      ) : (
        <InventoryTable
          inventory={filteredInventory}
          onUpdateStock={handleUpdateStock}
        />
      )}

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị {filteredInventory.length} trong tổng số {inventory.length} sản
        phẩm
      </div>
    </div>
  );
};

export default InventoryManagement;
