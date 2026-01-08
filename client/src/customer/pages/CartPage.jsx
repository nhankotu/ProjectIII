import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/common/EmptyState";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }

    if (cartCount === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (cartCount === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet."
          icon="🛒"
        >
          <button
            onClick={handleContinueShopping}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Shopping
          </button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
      <p className="text-gray-600 mb-8">
        You have {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-6 font-medium text-gray-700">
                Product
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-center">
                Price
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-center">
                Quantity
              </div>
              <div className="col-span-2 font-medium text-gray-700 text-center">
                Total
              </div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${item.variant?.id || ""}`}
                  item={item}
                />
              ))}
            </div>

            {/* Cart Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>

              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Have a Promo Code?</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-gray-800 text-white px-6 py-3 rounded-r-lg hover:bg-gray-900 transition-colors font-medium">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary />

          <div className="mt-6 space-y-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block w-full border-2 border-blue-600 text-blue-600 py-4 rounded-lg font-semibold text-center hover:bg-blue-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Security Badges */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="font-semibold mb-4">Secure Shopping</h4>
            <div className="flex justify-between">
              {["ssl", "lock", "shield", "payment"].map((badge) => (
                <div key={badge} className="text-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <span className="text-lg">🔒</span>
                  </div>
                  <span className="text-xs text-gray-600 capitalize">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Recently Viewed</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* You can implement recently viewed products here */}
          <div className="text-center text-gray-500 py-8">
            <p>No recently viewed products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
