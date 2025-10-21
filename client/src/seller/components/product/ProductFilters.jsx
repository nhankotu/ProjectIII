import React, { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";

const ProductManagement = () => {
  const { products, loading, addProduct, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = (productData) => {
    addProduct(productData);
    setShowAddModal(false);
  };

  const handleUpdateProduct = (updatedData) => {
    updateProduct(editingProduct.id, updatedData);
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleUpdateStock = (productId, newStock) => {
    updateProduct(productId, { stock: newStock });
  };

  const handleUpdateStatus = (productId, newStatus) => {
    updateProduct(productId, { status: newStatus });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
        <p className="text-gray-600">Tổng số: {products.length} sản phẩm</p>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onAddProduct={() => setShowAddModal(true)}
      />

      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onUpdateStock={handleUpdateStock}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Thêm sản phẩm mới</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sửa sản phẩm</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProductForm
                product={editingProduct}
                isEditing={true}
                onSubmit={handleUpdateProduct}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
