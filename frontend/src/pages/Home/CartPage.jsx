import React, { useEffect, useState } from "react";
import { useCart } from "../../components/contexts/CartContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const CartPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart(); // Thêm clearCart
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");

  const status = searchParams.get("status");
  const rawMessage = searchParams.get("message");

  const formatVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (status && rawMessage) {
      setMessage(decodeURIComponent(rawMessage));

      if (status === "success") {
        clearCart(); // Xóa giỏ hàng khi thanh toán thành công
      }

      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, rawMessage, clearCart]);

  const handleVnpayPayment = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail || userEmail.trim() === "") {
      alert("⚠️ Bạn cần đăng nhập trước khi thanh toán.");
      window.location.href = "/login";
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-vnpay",
        {
          amount: getTotalPrice() / 100,
          description: `Thanh toán bởi ${userEmail}`,
        }
      );

      if (res.data.vnpayUrl) {
        window.location.href = res.data.vnpayUrl;
      }
    } catch (error) {
      alert("Không thể kết nối đến VNPay.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🛒 Giỏ Hàng
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              status === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">
            Giỏ hàng của bạn đang trống.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cart.map((product, index) => (
                <li key={index} className="flex items-center gap-4 py-4">
                  <img
                    src={product.imageURL}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {product.quantity}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formatVND(product.price * product.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Tổng cộng:{" "}
                <span className="text-green-600">
                  {formatVND(getTotalPrice())}
                </span>
              </h3>
              <img
                src="/Image/vnpay.png"
                alt="Thanh toán với VNPay"
                onClick={handleVnpayPayment}
                className="mt-4 sm:mt-0 w-20 cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
