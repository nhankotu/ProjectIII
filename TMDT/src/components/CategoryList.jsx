import React, { useEffect, useState } from "react";
import Category from "./Category";
import "../CssStyle/CategoryList.css";

const CategoryList = ({ onCategoryNamesFetched }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  // Lọc danh sách hiển thị
  const filteredCategories =
    selectedCategory === null
      ? categories
      : categories.filter((cat) => cat.name === selectedCategory);

  return (
    <div className="category-list-container">
      {/* Bên trái: danh sách danh mục */}
      <div className="category-sidebar">
        <h3>Danh mục</h3>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              className={selectedCategory === category.name ? "active" : ""}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </li>
          ))}
          <li
            className={!selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả sản phẩm
          </li>
        </ul>
      </div>

      {/* Bên phải: sản phẩm theo danh mục đã chọn */}
      <div className="category-products">
        {filteredCategories.map((category) => (
          <Category
            key={category.id}
            title={category.name}
            products={category.products}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
