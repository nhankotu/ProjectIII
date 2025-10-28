import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import SearchFilter from "../components/product/SearchFilter";
import ProductTable from "../components/product/ProductTable";
import ProductModal from "../components/product/ProductModal";

const ProductManagement = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = async (productData) => {
    const result = await addProduct(productData);
    if (result.success) {
      setShowAddModal(false);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (productData) => {
    if (!editingProduct) return;

    const result = await updateProduct(editingProduct.id, productData);
    if (result.success) {
      setShowEditModal(false);
      setEditingProduct(null);
      alert("✅ Cập nhật sản phẩm thành công!");
    } else {
      alert(result.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await deleteProduct(productId);
    return result; // Trả về kết quả để ProductRow hiển thị thông báo
  };

  const handleUpdateStock = async (productId, newStock) => {
    await updateProduct(productId, { stock: newStock });
  };

  const handleUpdateStatus = async (productId, newStatus) => {
    await updateProduct(productId, { status: newStatus });
  };

  const resetForm = () => {
    setEditingProduct(null);
  };

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

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
        onAddProduct={() => setShowAddModal(true)}
        totalProducts={products.length}
      />

      <ProductTable
        products={products}
        onEditProduct={handleEditProduct}
        onUpdateStock={handleUpdateStock}
        onUpdateStatus={handleUpdateStatus}
        onDeleteProduct={handleDeleteProduct}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />

      <ProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Thêm sản phẩm mới"
        onSubmit={handleAddProduct}
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Sửa sản phẩm"
        isEditing={true}
        onSubmit={handleUpdateProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductManagement;
