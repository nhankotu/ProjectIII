import React, { useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import { Link } from "react-router-dom";

const OrderSummary = () => {
  const { cartItems, cartTotal, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateShipping = () => {
    if (cartTotal >= 500000) {
      return 0;
    }
    return 30000;
  };

  const calculateTax = () => {
    return cartTotal * 0.1; // 10% VAT
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    const validCoupons = {
      SAVE10: 0.1,
      SAVE20: 0.2,
      FREESHIP: 30000,
    };

    const discount = validCoupons[couponCode.toUpperCase()];

    if (discount) {
      const discountAmount =
        typeof discount === "number" ? discount : cartTotal * discount;

      setCouponApplied(true);
      setCouponDiscount(discountAmount);
    } else {
      alert("Invalid coupon code");
    }
  };

  const shipping = calculateShipping();
  const tax = calculateTax();
  const subtotal = cartTotal;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

      {/* Order Items */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Items ({cartCount})</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-sm font-bold whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span
            className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}
          >
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax (VAT 10%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {couponApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            disabled={couponApplied}
            className={`flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              couponApplied ? "bg-gray-100" : ""
            }`}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={couponApplied || !couponCode.trim()}
            className={`px-4 py-2 rounded-r-md font-medium ${
              couponApplied
                ? "bg-green-100 text-green-800 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {couponApplied ? "Applied" : "Apply"}
          </button>
        </div>
        {couponApplied && (
          <button
            onClick={() => {
              setCouponApplied(false);
              setCouponDiscount(0);
              setCouponCode("");
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Remove coupon
          </button>
        )}
      </div>

      {/* Estimated Delivery */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-blue-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-blue-900">Estimated Delivery</p>
            <p className="text-sm text-blue-800">
              {new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>30-day return policy • Free returns</p>
        <p className="mt-1">
          Need help?{" "}
          <Link to="/support" className="text-blue-600 hover:text-blue-700">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
