// src/components/admin/Products/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminProducts } from "../hooks/useAdminProducts";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    error,
    productDetail,
    fetchProductDetail,
    updateProductStatus,
    deleteProduct,
  } = useProducts();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
    }
  }, [id, fetchProductDetail]);

  const handleStatusChange = async () => {
    try {
      await updateProductStatus(id, newStatus);
      setShowStatusModal(false);
      setNewStatus("");
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      setShowDeleteModal(false);
      navigate("/admin/products");
    } catch (err) {
      // Error handled in hook
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading && !productDetail) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchProductDetail(id)}
          className="px-4 py-2 mt-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Không tìm thấy sản phẩm
        </h3>
        <p className="mt-1 text-gray-500">
          Sản phẩm bạn tìm kiếm không tồn tại.
        </p>
        <button
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusOptions = [
    { value: "pending", label: "Chờ duyệt" },
    { value: "approved", label: "Đã duyệt" },
    { value: "rejected", label: "Từ chối" },
    { value: "hidden", label: "Ẩn" },
    { value: "out_of_stock", label: "Hết hàng" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </button>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {productDetail.name}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status={productDetail.status} />
          <div className="flex space-x-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              Đổi trạng thái
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Product Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin sản phẩm
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    SKU
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {productDetail.sku}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Danh mục
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {productDetail.category?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Giá
                  </label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatPrice(productDetail.price)}
                  </p>
                  {productDetail.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(productDetail.originalPrice)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tồn kho
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {productDetail.stock} sản phẩm
                  </p>
                  <p className="text-sm text-gray-500">
                    Đã bán: {productDetail.sold || 0}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500">
                  Mô tả
                </label>
                <div className="mt-2 prose prose-sm max-w-none">
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {productDetail.description}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              {productDetail.specifications &&
                Object.keys(productDetail.specifications).length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Thông số kỹ thuật
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                        {Object.entries(productDetail.specifications).map(
                          ([key, value]) => (
                            <div key={key}>
                              <dt className="text-sm font-medium text-gray-500">
                                {key}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {value}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Product Images */}
          <div className="mt-6 bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Hình ảnh sản phẩm
              </h2>
              {productDetail.images && productDetail.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {productDetail.images.map((image, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1">
                      <img
                        src={image}
                        alt={`${productDetail.name} - ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Không có hình ảnh
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Seller Info & Activity */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin người bán
              </h2>
              <div className="flex items-center space-x-3">
                {productDetail.seller?.avatar ? (
                  <img
                    className="w-12 h-12 rounded-full"
                    src={productDetail.seller.avatar}
                    alt={productDetail.seller.name}
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {productDetail.seller?.name?.charAt(0)?.toUpperCase() ||
                        "S"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {productDetail.seller?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {productDetail.seller?.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Điểm đánh giá:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {productDetail.seller?.rating || "Chưa có"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Số sản phẩm:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {productDetail.seller?.productCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tham gia:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(productDetail.seller?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Activity */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Lịch sử hoạt động
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ngày tạo
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(productDetail.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Lần cập nhật cuối
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(productDetail.updatedAt)}
                  </p>
                </div>
                {productDetail.lastStatusChange && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Trạng thái cuối
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(productDetail.lastStatusChange.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Bởi: {productDetail.lastStatusChange.by}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowStatusModal(false)}
            ></div>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Đổi trạng thái sản phẩm
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Sản phẩm:{" "}
                        <span className="font-medium">
                          {productDetail.name}
                        </span>
                      </p>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Chọn trạng thái mới
                        </label>
                        <select
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="">Chọn trạng thái...</option>
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleStatusChange}
                  disabled={!newStatus || loading}
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus("");
                  }}
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa Sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productDetail.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        type="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default ProductDetail;
