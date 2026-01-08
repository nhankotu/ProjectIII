// src/components/admin/Categories/CategoryManager.jsx
import React, { useState } from "react";
import { useCategories } from "../../../hooks/admin/useCategories";
import CreateCategoryModal from "./CreateCategoryModal";
import ConfirmModal from "../Common/ConfirmModal";

const CategoryManager = ({ categories = [], onRefresh }) => {
  const { loading, error, deleteCategory } = useCategories();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedCategory.id);
      setShowDeleteModal(false);
      setSelectedCategory(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setLocalError(err.message || "Có lỗi khi xóa danh mục");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + Thêm danh mục
        </button>
      </div>

      {localError && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{localError}</p>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Chưa có danh mục nào
          </h3>
          <p className="mt-1 text-gray-500">
            Bắt đầu bằng cách tạo danh mục đầu tiên.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Tạo danh mục
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {category.icon ? (
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    {category.productCount || 0} SP
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Slug:</span> {category.slug}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Tạo ngày:{" "}
                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    onClick={() => {
                      // Edit functionality can be added here
                    }}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowDeleteModal(true);
                    }}
                    className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDelete}
        title="Xóa Danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory?.name}"? Sản phẩm trong danh mục sẽ được chuyển sang danh mục mặc định.`}
        confirmText="Xóa"
        type="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default CategoryManager;
