import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import CheckoutForm from "../components/cart/CheckoutForm";
import OrderSummary from "../components/cart/OrderSummary";
import LoadingSpinner from "../components/common/LoadingSpinner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?redirect=/checkout");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartCount === 0 && !orderCompleted) {
      navigate("/cart");
    }
  }, [cartCount, navigate, orderCompleted]);

  const handlePlaceOrder = async (orderData) => {
    try {
      setOrderProcessing(true);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock order ID
      const mockOrderId = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      setOrderId(mockOrderId);

      // Clear cart
      clearCart();

      // Show success
      setOrderCompleted(true);
      setStep(4);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setOrderProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", description: "Address & Contact" },
    { number: 2, title: "Payment", description: "Payment Method" },
    { number: 3, title: "Review", description: "Order Review" },
    { number: 4, title: "Confirmation", description: "Order Complete" },
  ];

  if (authLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number</span>
                <span className="font-bold text-lg">{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-xl text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    cartItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/account/orders")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate("/products")}
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-12 text-left">
            <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-gray-600 text-sm">
                    We'll verify your order and prepare it for shipping.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Shipping</h4>
                  <p className="text-gray-600 text-sm">
                    Your order will be shipped within 24 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Delivery</h4>
                  <p className="text-gray-600 text-sm">
                    Expected delivery: 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10">
            <div
              className="h-1 bg-blue-600 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step >= stepItem.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                } ${step === stepItem.number ? "ring-4 ring-blue-100" : ""}`}
              >
                {step > stepItem.number ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="font-bold">{stepItem.number}</span>
                )}
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-medium ${
                    step >= stepItem.number ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {stepItem.title}
                </div>
                <div className="text-xs text-gray-500">
                  {stepItem.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>
              <CheckoutForm user={user} onNext={() => setStep(2)} />
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>
              <div className="space-y-4">
                {["credit_card", "paypal", "cod", "bank_transfer"].map(
                  (method) => (
                    <label
                      key={method}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        defaultChecked={method === "credit_card"}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div className="ml-4 flex-grow">
                        <div className="font-medium capitalize">
                          {method.replace("_", " ")}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method === "credit_card" &&
                            "Pay with your credit or debit card"}
                          {method === "paypal" &&
                            "Pay with your PayPal account"}
                          {method === "cod" && "Pay when you receive the order"}
                          {method === "bank_transfer" &&
                            "Transfer money directly to our bank account"}
                        </div>
                      </div>
                    </label>
                  )
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Shipping
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Review
              </h2>

              {/* Shipping Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">John Doe</p>
                  <p className="text-gray-600">123 Main Street, District 1</p>
                  <p className="text-gray-600">Ho Chi Minh City, Vietnam</p>
                  <p className="text-gray-600">Phone: +84 123 456 789</p>
                  <p className="text-gray-600">Email: john@example.com</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">Credit Card</p>
                  <p className="text-gray-600">Visa ending in 4242</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderProcessing}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    orderProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {orderProcessing ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary />

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <h4 className="font-medium text-blue-900">Secure Checkout</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Your information is protected with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-3">Need Help?</h4>
            <div className="space-y-2 text-sm">
              <a
                href="tel:+84123456789"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +84 123 456 789
              </a>
              <a
                href="mailto:support@shopease.com"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                support@shopease.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
