import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getCategories();

        // Logic kiểm tra dữ liệu an toàn (giống các file trước)
        let data = [];
        if (response && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else if (response?.categories) {
          data = response.categories;
        }

        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryColors = [
    "bg-blue-50 text-blue-700 hover:bg-blue-100",
    "bg-green-50 text-green-700 hover:bg-green-100",
    "bg-purple-50 text-purple-700 hover:bg-purple-100",
    "bg-pink-50 text-pink-700 hover:bg-pink-100",
    "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">Đang tải danh mục...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tất cả Danh mục
        </h1>
        <p className="text-gray-600">
          Khám phá các bộ sưu tập sản phẩm đa dạng của chúng tôi
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500">Chưa có danh mục nào.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat._id || cat.id}
              to={`/products/${cat.slug}`} // Link tới trang lọc sản phẩm
              className={`block p-6 rounded-xl border border-transparent transition-all transform hover:-translate-y-1 hover:shadow-md ${
                categoryColors[index % categoryColors.length]
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm">
                  {cat.icon || "📦"}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {cat.name}
                </h3>
                <span className="text-sm opacity-75">
                  {cat.productCount
                    ? `${cat.productCount} sản phẩm`
                    : "Khám phá ngay"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
