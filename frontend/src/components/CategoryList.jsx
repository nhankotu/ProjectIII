import React, { useEffect, useState } from "react";
import Category from "./Category";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const CategoryList = ({ onCategoryNamesFetched }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false); // trạng thái thu gọn sidebar

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        const names = data.map((category) => category.name);
        if (onCategoryNamesFetched) {
          onCategoryNamesFetched(names);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleCollapseSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredCategories =
    selectedCategory === null
      ? categories
      : categories.filter((cat) => cat.name === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar danh mục */}
      <div
        className={`bg-white p-4 shadow-md mt-4 rounded-lg sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto
          transition-width duration-300
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Nút toggle thu gọn sidebar */}
        <button
          onClick={toggleCollapseSidebar}
          className="mb-4 p-1 rounded hover:bg-yellow-300 text-yellow-700"
          title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <FiChevronRight size={24} />
          ) : (
            <FiChevronLeft size={24} />
          )}
        </button>

        {/* Nếu collapsed thì ẩn phần text, chỉ hiện icon hoặc chữ viết tắt (nếu có) */}
        {!isCollapsed && (
          <>
            <h3 className="text-xl font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedCategory === category.name
                      ? "bg-yellow-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </li>
              ))}
              <li
                onClick={() => setSelectedCategory(null)}
                className={`cursor-pointer p-2 rounded ${
                  !selectedCategory
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                All
              </li>
            </ul>
          </>
        )}

        {/* Nếu collapsed, có thể hiện icon danh mục nhỏ hoặc chỉ dấu */}
        {isCollapsed && (
          <ul className="space-y-2 text-center text-sm">
            {categories.map((category) => (
              <li
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={`cursor-pointer p-2 rounded ${
                  selectedCategory === category.name
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* Ví dụ chỉ hiện chữ cái đầu */}
                {category.name.charAt(0)}
              </li>
            ))}
            <li
              onClick={() => setSelectedCategory(null)}
              className={`cursor-pointer p-2 rounded ${
                !selectedCategory
                  ? "bg-yellow-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              ALL
            </li>
          </ul>
        )}
      </div>

      {/* Nội dung sản phẩm bên phải */}
      <div className="flex-1 p-6 space-y-6 overflow-x-hidden">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories[category.id];
          const productsToShow =
            selectedCategory || isExpanded
              ? category.products
              : category.products.slice(0, 4);

          return (
            <div key={category.id}>
              <Category title={category.name} products={productsToShow} />
              {!selectedCategory && category.products.length > 4 && (
                <div className="text-right mt-2">
                  <button
                    className="text-yellow-800 text-sm hover:underline"
                    onClick={() => toggleExpand(category.id)}
                  >
                    {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
