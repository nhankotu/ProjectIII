import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CartItem from "../components/cart/CartItem";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { useCart } from "../components/hooks/useCart";
import { useCheckout } from "../components/hooks/useCheckout";
import { useAuth } from "../components/hooks/useAuth";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building,
  Truck,
  MapPin,
  User,
  Phone,
  Home,
} from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, itemsCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const {
    loading,
    placeOrder,
    calculateOrderSummary,
    validateCheckout,
    getShippingOptions,
    getPaymentMethods,
  } = useCheckout();

  const [formData, setFormData] = useState({
    shippingAddress: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: "",
      city: "",
      district: "",
      ward: "",
    },
    shippingMethod: "standard",
    paymentMethod: "cod",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const shippingOptions = getShippingOptions();
  const paymentMethods = getPaymentMethods();
  const orderSummary = calculateOrderSummary(
    shippingOptions.find((opt) => opt.id === formData.shippingMethod)?.fee || 0
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateCheckout(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const result = await placeOrder(formData);
    if (result.success) {
      navigate("/order-success", {
        state: { order: result.order },
      });
    } else {
      // Handle error (show toast message)
      console.error("Order failed:", result.error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          type="cart"
          title="Giỏ hàng trống"
          description="Hãy thêm sản phẩm vào giỏ hàng để thanh toán"
          actionText="Tiếp tục mua sắm"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        <Button variant="outline" asChild>
          <Link to="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại giỏ hàng
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Địa chỉ giao hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Họ và tên *
                    </label>
                    <Input
                      value={formData.shippingAddress.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Nhập họ và tên"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Số điện thoại *
                    </label>
                    <Input
                      value={formData.shippingAddress.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Nhập số điện thoại"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.shippingAddress.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Nhập email"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Địa chỉ *
                    </label>
                    <Input
                      value={formData.shippingAddress.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Số nhà, tên đường"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Thành phố/Tỉnh
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Quận/Huyện
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cg">Cầu Giấy</SelectItem>
                        <SelectItem value="th">Thanh Xuân</SelectItem>
                        <SelectItem value="hk">Hoàn Kiếm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Phương thức vận chuyển
                </h2>

                <RadioGroup
                  value={formData.shippingMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, shippingMethod: value }))
                  }
                >
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3 border rounded-lg p-4 mb-2"
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={`shipping-${option.id}`}
                      />
                      <label
                        htmlFor={`shipping-${option.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-gray-500">
                              {option.description}
                            </div>
                          </div>
                          <div className="font-semibold">
                            {option.fee === 0
                              ? "Miễn phí"
                              : formatPrice(option.fee)}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Phương thức thanh toán
                </h2>

                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, paymentMethod: value }))
                  }
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 border rounded-lg p-4 mb-2"
                    >
                      <RadioGroupItem
                        value={method.id}
                        id={`payment-${method.id}`}
                      />
                      <label
                        htmlFor={`payment-${method.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">
                          {method.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>

                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.paymentMethod}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Ghi chú đơn hàng</h2>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  className="w-full h-24 p-3 border rounded-lg resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span
                      className={
                        orderSummary.shippingFee === 0 ? "text-green-600" : ""
                      }
                    >
                      {orderSummary.shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(orderSummary.shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {formatPrice(orderSummary.total)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" text="" className="mr-2" />
                  ) : null}
                  Đặt hàng
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Bằng cách đặt hàng, bạn đồng ý với
                  <a href="/terms" className="text-blue-600 hover:underline">
                    {" "}
                    Điều khoản dịch vụ
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default CheckoutPage;
