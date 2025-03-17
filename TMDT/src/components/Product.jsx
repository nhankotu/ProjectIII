import React, { useState } from "react";
import "../Stylecss/Product.css";

const Product = ({ product }) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const handleClick = () => {
    setIsDetailVisible(true);
  };

  const handleClose = () => {
    setIsDetailVisible(false);
  };

  return (
    <div>
      {/* Card Product */}
      <div className="product-card" onClick={handleClick}>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span>${product.price}</span>
        <button>Add to Cart</button>
      </div>
    </div>
  );
};

export default Product;
