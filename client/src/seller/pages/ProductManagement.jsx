import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import SearchFilter from "../components/product/SearchFilter";
import ProductTable from "../components/product/ProductTable";
import ProductModal from "../components/product/ProductModal";

const ProductManagement = () => {
  // Hook lấy dữ liệu từ API (Đã bao gồm logic tạo FormData bên trong)
  const { products, loading, addProduct, updateProduct, deleteProduct } =
    useProducts();

  // State quản lý UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. Xử lý Thêm mới
  // Lưu ý: payload nhận vào là Object thuần từ ProductForm
  const handleAddProduct = async (productPayload) => {
    const result = await addProduct(productPayload);

    if (result.success) {
      setShowAddModal(false);
      alert("✅ Thêm sản phẩm thành công!");
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  };

  // 2. Xử lý mở Modal Sửa
  const handleEditProduct = (product) => {
    // Không cần format dữ liệu thủ công ở đây nữa
    // ProductForm mới sẽ tự xử lý việc lấy _id của category/brand
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // 3. Xử lý Cập nhật (Submit form sửa)
  const handleUpdateProduct = async (productPayload) => {
    if (!editingProduct) return;

    // Hook updateProduct sẽ tự convert productPayload thành FormData
    const result = await updateProduct(editingProduct._id, productPayload);

    if (result.success) {
      setShowEditModal(false);
      setEditingProduct(null);
      alert("✅ Cập nhật sản phẩm thành công!");
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  };

  // 4. Xử lý Xóa
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const result = await deleteProduct(productId);
      if (result.success) {
        alert("✅ Đã xóa sản phẩm");
      } else {
        alert("❌ Lỗi xóa: " + result.message);
      }
    }
  };

  // 5. Cập nhật nhanh Tồn kho (Quick Edit trên bảng)
  const handleUpdateStock = async (productId, newStock) => {
    // Gửi Object thường, Hook sẽ tự xử lý
    await updateProduct(productId, { stock: parseInt(newStock) });
  };

  // 6. Cập nhật nhanh Trạng thái (Quick Edit trên bảng)
  const handleUpdateStatus = async (productId, newStatus) => {
    await updateProduct(productId, { status: newStatus });
  };

  const resetForm = () => {
    setEditingProduct(null);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg font-medium text-gray-600">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-600 mt-1">
            Tổng số:{" "}
            <span className="font-bold text-blue-600">{products.length}</span>{" "}
            sản phẩm
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
        onAddProduct={() => setShowAddModal(true)}
      />

      {/* Main Table */}
      <div className="mt-6">
        <ProductTable
          products={products}
          onEditProduct={handleEditProduct}
          onUpdateStock={handleUpdateStock}
          onUpdateStatus={handleUpdateStatus}
          onDeleteProduct={handleDeleteProduct}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </div>

      {/* Modal Thêm Mới */}
      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          title="Thêm sản phẩm mới"
          onSubmit={handleAddProduct} // Truyền hàm xử lý vào đây
        />
      )}

      {/* Modal Chỉnh Sửa */}
      {showEditModal && (
        <ProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
          title="Cập nhật sản phẩm"
          isEditing={true}
          product={editingProduct}
          onSubmit={handleUpdateProduct} // Truyền hàm xử lý vào đây
        />
      )}
    </div>
  );
};

export default ProductManagement;
