// Category.js
import React from "react";
import "../CssStyle/Category.css"; 
import Product from "./Product"; 

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
