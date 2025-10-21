import { useState } from "react";
import { useCart } from "./useCart";
import { useAuth } from "./useAuth";

export const useCheckout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const calculateOrderSummary = (shippingFee = 0) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + shippingFee;

    return {
      subtotal,
      shippingFee,
      total,
      itemsCount: items.reduce((count, item) => count + item.quantity, 0),
    };
  };

  const validateCheckout = (checkoutData) => {
    const errors = {};

    if (!checkoutData.shippingAddress?.name) {
      errors.shippingAddress = "Vui lòng nhập họ tên người nhận";
    }

    if (!checkoutData.shippingAddress?.phone) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(checkoutData.shippingAddress.phone)
    ) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!checkoutData.shippingAddress?.address) {
      errors.address = "Vui lòng nhập địa chỉ giao hàng";
    }

    if (!checkoutData.paymentMethod) {
      errors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const placeOrder = async (orderData) => {
    setLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderSummary = calculateOrderSummary(orderData.shippingFee || 0);

      const newOrder = {
        id: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: "pending",
        customer: {
          id: user?.id,
          name: orderData.shippingAddress.name,
          phone: orderData.shippingAddress.phone,
          email: user?.email,
        },
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0],
        })),
        ...orderSummary,
      };

      // Simulate successful order
      setOrder(newOrder);

      // Clear cart after successful order
      if (orderData.paymentMethod !== "cod") {
        // For online payments, wait for payment confirmation
        // clearCart();
      } else {
        clearCart();
      }

      return {
        success: true,
        order: newOrder,
        message: "Đặt hàng thành công!",
      };
    } catch (error) {
      return {
        success: false,
        error: "Đặt hàng thất bại. Vui lòng thử lại.",
      };
    } finally {
      setLoading(false);
    }
  };

  const getShippingOptions = () => {
    return [
      {
        id: "standard",
        name: "Giao hàng tiêu chuẩn",
        description: "Giao trong 3-5 ngày",
        fee: 25000,
        estimatedDays: "3-5 ngày",
      },
      {
        id: "express",
        name: "Giao hàng nhanh",
        description: "Giao trong 1-2 ngày",
        fee: 50000,
        estimatedDays: "1-2 ngày",
      },
      {
        id: "free",
        name: "Giao hàng miễn phí",
        description: "Giao trong 3-5 ngày",
        fee: 0,
        estimatedDays: "3-5 ngày",
        condition: "Đơn hàng từ 300.000đ",
      },
    ];
  };

  const getPaymentMethods = () => {
    return [
      {
        id: "cod",
        name: "Thanh toán khi nhận hàng",
        description: "Trả tiền mặt khi nhận hàng",
      },
      {
        id: "momo",
        name: "Ví MoMo",
        description: "Thanh toán qua ứng dụng MoMo",
      },
      {
        id: "banking",
        name: "Chuyển khoản ngân hàng",
        description: "Chuyển khoản qua Internet Banking",
      },
      {
        id: "credit",
        name: "Thẻ tín dụng/ghi nợ",
        description: "Thanh toán qua thẻ Visa, Mastercard",
      },
    ];
  };

  return {
    loading,
    order,
    placeOrder,
    calculateOrderSummary,
    validateCheckout,
    getShippingOptions,
    getPaymentMethods,
  };
};
