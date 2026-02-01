import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Đảm bảo đường dẫn import đúng
import { productAPI as productService } from "../../services/api";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getCategories();

        // --- LOGIC SỬA LỖI: Kiểm tra kỹ dữ liệu trả về ---
        let categoryArray = [];

        if (response && Array.isArray(response.data)) {
          categoryArray = response.data; // Trường hợp: { data: [...] }
        } else if (Array.isArray(response)) {
          categoryArray = response; // Trường hợp: [...]
        } else if (response && Array.isArray(response.categories)) {
          categoryArray = response.categories; // Trường hợp: { categories: [...] }
        }

        setCategories(categoryArray.slice(0, 8));
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set mảng rỗng nếu lỗi để không sập web
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryColors = [
    "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800",
    "bg-gradient-to-br from-green-100 to-green-200 text-green-800",
    "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800",
    "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-800",
    "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800",
    "bg-gradient-to-br from-red-100 to-red-200 text-red-800",
    "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-800",
    "bg-gradient-to-br from-teal-100 to-teal-200 text-teal-800",
  ];

  if (loading) {
    return (
      <section className="py-12">
        <div className="animate-pulse container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Nếu không có danh mục nào thì ẩn section hoặc hiện thông báo tùy bạn
  if (categories.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🛍️ Danh mục sản phẩm
          </h2>
          <p className="text-gray-600">Số lượng sản phẩm theo từng danh mục</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Link
              // SỬA: Dùng _id (MongoDB) hoặc id
              key={category._id || category.id}
              to={`/products/${category.slug}`}
              className="group"
            >
              <div
                className={`${
                  categoryColors[index % categoryColors.length]
                } rounded-xl p-6 text-center transition-transform group-hover:scale-105 group-hover:shadow-lg h-full flex flex-col items-center justify-center`}
              >
                {/* Category Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">{category.icon || "📦"}</span>
                </div>

                {/* Category Name */}
                <h3 className="font-semibold mb-1 truncate w-full px-2">
                  {category.name}
                </h3>

                {/* Product Count */}
                <p className="text-sm opacity-75">
                  {category.productCount || 0} products
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <span>View All Categories</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
