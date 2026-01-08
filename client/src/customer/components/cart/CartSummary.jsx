import React, { useState } from "react";
import { useCart } from "../../../contexts/CartContext";

const CartSummary = () => {
  const { cartTotal, cartCount } = useCart();
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
    return 30000; // 30,000 VND shipping fee
  };

  const calculateTax = () => {
    return cartTotal * 0.1; // 10% VAT
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    // Mock coupon validation
    const validCoupons = {
      SAVE10: 0.1, // 10% discount
      SAVE20: 0.2, // 20% discount
      FREESHIP: 30000, // Free shipping
    };

    const discount = validCoupons[couponCode.toUpperCase()];

    if (discount) {
      const discountAmount =
        typeof discount === "number" ? discount : cartTotal * discount;

      setCouponApplied(true);
      setCouponDiscount(discountAmount);
      alert(`Coupon applied! You saved ${formatPrice(discountAmount)}`);
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

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cartCount} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span
            className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}
          >
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (VAT 10%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Coupon Discount */}
        {couponApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>

        {/* Coupon Input */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apply Coupon
          </label>
          <div className="flex">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={couponApplied}
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
      </div>

      {/* Savings Info */}
      {cartTotal < 500000 && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">
              Spend {formatPrice(500000 - cartTotal)} more
            </span>{" "}
            to get free shipping!
          </p>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">Accepted Payment Methods</p>
        <div className="flex space-x-2">
          {["visa", "mastercard", "paypal", "cod"].map((method) => (
            <div
              key={method}
              className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center"
            >
              <span className="text-xs font-medium">{method}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
