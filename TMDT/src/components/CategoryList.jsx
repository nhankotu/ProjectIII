import React, { useEffect, useState } from "react";
import Category from "./Category";
import "../CssStyle/CategoryList.css";

const CategoryList = ({ onCategoryNamesFetched }) => {
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  useEffect(() => {
    // Lấy danh mục sản phẩm từ API
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data); // Cập nhật danh mục và sản phẩm
        const names = data.map((category) => category.name);
        setCategoryNames(names);
        if (onCategoryNamesFetched) {
          onCategoryNamesFetched(names);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  return (
    <div>
      {categories.map((category) => (
        <Category
          key={category.id}
          title={category.name}
          products={category.products}
        />
      ))}
    </div>
  );
};

export default CategoryList;
