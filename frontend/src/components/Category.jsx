import React from "react";
import Product from "./Product";

const Category = ({ title, products }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-yellow-600 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Category;
