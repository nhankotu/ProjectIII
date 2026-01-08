import React, { useEffect, useState } from "react";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

const CategoriesPage = () => {
  const {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  } = useAdminCategories();

  // State cho Form tạo mới
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Giả sử backend nhận JSON. Nếu nhận file ảnh thì dùng FormData()
    const success = await createCategory({ name, description: desc });
    if (success) {
      setName("");
      setDesc("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Danh mục</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Tạo Mới */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} /> Thêm danh mục
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên danh mục
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Tạo mới
            </button>
          </form>
        </div>

        {/* Danh sách */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Icon</th>
                <th className="p-4 font-medium text-gray-600">Tên</th>
                <th className="p-4 font-medium text-gray-600">Slug</th>
                <th className="p-4 text-right font-medium text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-gray-500 text-sm">{cat.slug}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
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
  );
};

export default CategoriesPage;
