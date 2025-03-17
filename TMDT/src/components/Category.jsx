// Category.js
import React from "react";
import "../Stylecss/Category.css"; // Đảm bảo bạn đã tạo file CSS tương ứng
import Product from "./Product"; // Chúng ta sẽ tạo component Product sau

const Category = ({ title, products }) => {
  return (
    <div className="category">
      <h2>{title}</h2>
      <div className="product-list">
        {products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Category;
