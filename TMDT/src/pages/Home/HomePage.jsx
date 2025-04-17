import React, { useState } from "react";
import CategoryList from "../../components/CategoryList";
import "../../CssStyle/HomePage.css";

function HomePage() {
  const [categoryNames, setCategoryNames] = useState([]); // Lưu danh sách tên danh mục

  // Hàm xử lý khi nhận danh sách tên danh mục từ CategoryList
  const handleCategoryNamesFetched = (names) => {
    setCategoryNames(names);
  };

  return (
    <div className="home-page">
      <h1>NTH-SHOP</h1>
      {/* Hiển thị danh sách tên danh mục và sản phẩm */}
      <div className="container">
        <div className="container-product">
          {/* Hiển thị danh mục sản phẩm */}
          <CategoryList onCategoryNamesFetched={handleCategoryNamesFetched} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
