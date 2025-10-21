import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/common/EmptyState";
import { useCart } from "../components/hooks/useCart";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";

const CartPage = () => {
  const { items, total, itemsCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          type="cart"
          title="Giỏ hàng trống"
          description="Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm"
          actionText="Tiếp tục mua sắm"
          actionLink="/" // Thêm actionLink thay vì onAction
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Giỏ hàng</h1>
            <p className="text-gray-600">
              {itemsCount} sản phẩm trong giỏ hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Sản phẩm đã chọn</h2>
                <span className="text-sm text-gray-500">
                  {itemsCount} sản phẩm
                </span>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Cart Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Tạm tính</p>
                  <div className="text-lg font-semibold">
                    {formatPrice(total)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Viewed */}
          <RecentlyViewedSection />
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

// Component for Recently Viewed Section
const RecentlyViewedSection = () => {
  const recentlyViewed = []; // Mock data - có thể lấy từ context ho localStorage

  if (recentlyViewed.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Có thể bạn quan tâm</h3>
          <div className="text-center text-gray-500 py-4">
            <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Không có sản phẩm đề xuất</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Sản phẩm đã xem gần đây</h3>
        <div className="grid grid-cols-2 gap-3">
          {recentlyViewed.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="block hover:shadow-md transition-shadow rounded-lg border p-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-16 object-cover rounded mb-1"
              />
              <p className="text-xs font-medium line-clamp-2 mb-1">
                {product.name}
              </p>
              <p className="text-xs text-red-600 font-semibold">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Format price helper - Đảm bảo xử lý được nhiều định dạng
const formatPrice = (price) => {
  // Nếu price là string có ký tự VND, chuyển về number
  const numericPrice =
    typeof price === "string" ? parseInt(price.replace(/[^\d]/g, "")) : price;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numericPrice || 0);
};

export default CartPage;
