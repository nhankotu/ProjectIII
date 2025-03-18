import React from "react";
import { useCart } from "../../components/contexts/CartContext"; // Import CartContext
import "../../CssStyle/CartPage.css";

const CartPage = () => {
  const { cart, getTotalPrice } = useCart(); // Sử dụng CartContext

  return (
    <div className="cart-page">
      <h1>Giỏ Hàng</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          <ul>
            {cart.map((product, index) => (
              <li key={index}>
                <img src={product.imageURL} alt={product.name} />
                <p className="cart-container">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Số lượng: {product.quantity}</p> {/* Hiển thị số lượng */}
                  <span>${product.price}</span>
                </p>
              </li>
            ))}
          </ul>
          <div className="total">
            <h3>Tổng cộng: ${getTotalPrice()}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
