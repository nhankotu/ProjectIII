import React, { useState } from "react";
import { useCart } from "./contexts/CartContext"; // Import CartContext
import "../CssStyle/Product.css";

const Product = ({ product }) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const { addToCart } = useCart(); // Sử dụng hàm addToCart từ CartContext

  const handleClick = () => {
    setIsDetailVisible(true);
  };

  const handleClose = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    setIsDetailVisible(false);
  };

  return (
    <div>
      {/* Card sản phẩm */}
      <div className="product-card" onClick={handleClick}>
        <img src={product.imageURL} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span>${product.price}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn mở chi tiết sản phẩm
            addToCart(product); // Thêm vào giỏ hàng
          }}
        >
          🛒 Thêm vào giỏ
        </button>
      </div>

      {/* Chi tiết sản phẩm (hiện khi bấm vào sản phẩm) */}
      {isDetailVisible && (
        <div className="product-detail-overlay" onClick={handleClose}>
          <div className="product-detail" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>
              ❌
            </button>
            <img src={product.imageURL} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span>💲 Giá: ${product.price}</span>
            <button onClick={() => addToCart(product)}>🛒 Thêm vào giỏ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
