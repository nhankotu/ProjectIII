import React, { useState, useMemo } from "react";
import { useInventory } from "../hooks/useInventory";
import InventoryStats from "../components/inventory/InventoryStats";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";

const InventoryManagement = () => {
  const { inventory, loading, updateStock, getInventoryStats, refetch } =
    useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter inventory
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải tồn kho...</div>
      </div>
    );
  }

  return (
    <div>
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
        onSearchChange={setSearchTerm}
        onCategoryFilterChange={setCategoryFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={refetch}
      />

      {/* Inventory Table */}
      <InventoryTable
        inventory={filteredInventory}
        onUpdateStock={updateStock}
      />

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị {filteredInventory.length} trong tổng số {inventory.length} sản
        phẩm
      </div>
    </div>
  );
};

export default InventoryManagement;
