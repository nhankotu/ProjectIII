import React, { useEffect, useState } from "react";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { Trash2, Plus, Image as ImageIcon, X } from "lucide-react";

const CategoriesPage = () => {
  const {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  } = useAdminCategories();

  // Form State
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [parentId, setParentId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);

    if (parentId) formData.append("parentId", parentId);

    if (file) {
      formData.append("images", file);
    }

    const success = await createCategory(formData);

    if (success) {
      setName("");
      setDesc("");
      setParentId("");
      handleRemoveFile();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Danh mục</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* === FORM TẠO MỚI === */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-100">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-indigo-600">
            <Plus size={20} /> Thêm danh mục mới
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="VD: Điện thoại, Thời trang..."
                required
              />
            </div>

            {/* 2. Parent Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục cha (Tùy chọn)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">-- Không có (Là danh mục gốc) --</option>
                {/* Use displayName to show hierarchy in dropdown */}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.displayName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Để trống nếu đây là danh mục lớn nhất (Cấp 1).
              </p>
            </div>

            {/* 3. Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện
              </label>
              {!preview ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative mt-1 group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                rows="3"
                placeholder="Nhập mô tả ngắn..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium shadow-md transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700 active:transform active:scale-95"
              }`}
            >
              {loading ? "Đang xử lý..." : "Tạo mới danh mục"}
            </button>
          </form>
        </div>

        {/* === LIST VIEW === */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Hình ảnh</th>
                  <th className="p-4 font-semibold text-gray-600">
                    Tên danh mục
                  </th>
                  <th className="p-4 font-semibold text-gray-600">
                    Đường dẫn (Slug)
                  </th>
                  <th className="p-4 text-right font-semibold text-gray-600">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-400">
                      Chưa có danh mục nào được tạo.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="p-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {/* 🔥 Indentation Logic for Table 🔥 */}
                        <div
                          className="flex items-center gap-2 relative"
                          style={{ paddingLeft: `${cat.level * 24}px` }}
                        >
                          {/* Add an elbow connector for child categories */}
                          {cat.level > 0 && (
                            <span className="text-gray-300">└──</span>
                          )}

                          <div
                            className={`font-semibold ${cat.level === 0 ? "text-indigo-700" : "text-gray-800"}`}
                          >
                            {cat.originalName}
                          </div>
                        </div>

                        {cat.description && (
                          <div
                            className="text-xs text-gray-500 truncate max-w-[200px] mt-1"
                            style={{ paddingLeft: `${cat.level * 24}px` }}
                          >
                            {cat.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                          /{cat.slug}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteCategory(cat._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors inline-flex items-center"
                          title="Xóa danh mục"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
