// src/components/admin/Categories/CreateCategoryModal.jsx
import React, { useState } from "react";
import { useCategories } from "../../../hooks/admin/useCategories";

const CreateCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const { loading, error, createCategory } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    icon: "",
    parentId: "",
  });
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Basic validation
    if (!formData.name.trim()) {
      setLocalError("Tên danh mục là bắt buộc");
      return;
    }

    if (!formData.slug.trim()) {
      setLocalError("Slug là bắt buộc");
      return;
    }

    try {
      await createCategory(formData);
      onSuccess();
      resetForm();
    } catch (err) {
      setLocalError(err.message || "Có lỗi khi tạo danh mục");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      icon: "",
      parentId: "",
    });
    setLocalError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData({ ...formData, slug });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Tạo danh mục mới
                  </h3>

                  {(error || localError) && (
                    <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">
                        {localError || error}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tên danh mục *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={loading}
                      />
                    </div>

                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label
                          htmlFor="slug"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Slug *
                        </label>
                        <input
                          type="text"
                          id="slug"
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          disabled={loading}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        disabled={loading || !formData.name}
                      >
                        Tạo slug
                      </button>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mô tả
                      </label>
                      <textarea
                        id="description"
                        rows="3"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="icon"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Icon (emoji)
                      </label>
                      <input
                        type="text"
                        id="icon"
                        placeholder="🎮, 👕, 📱, ..."
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="parentId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Danh mục cha
                      </label>
                      <select
                        id="parentId"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.parentId}
                        onChange={(e) =>
                          setFormData({ ...formData, parentId: e.target.value })
                        }
                        disabled={loading}
                      >
                        <option value="">Không có (danh mục gốc)</option>
                        {/* Categories would be loaded here */}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tạo...
                  </span>
                ) : (
                  "Tạo danh mục"
                )}
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
