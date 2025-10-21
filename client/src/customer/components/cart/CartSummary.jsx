// components/cart/CartSummary.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Truck, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

const CartSummary = () => {
  const { items, total, itemsCount } = useCart();

  const shippingFee = total > 300000 ? 0 : 25000;
  const finalTotal = total + shippingFee;
  const freeShippingThreshold = 300000;
  const remainingForFreeShipping = freeShippingThreshold - total;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Giỏ hàng trống</h3>
          <p className="text-gray-500 mb-4">
            Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
          </p>
          <Button asChild className="w-full">
            <Link to="/">Tiếp tục mua sắm</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5" />
          <span>Tóm tắt đơn hàng</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Tạm tính ({itemsCount} sản phẩm)
            </span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span
              className={
                shippingFee === 0
                  ? "text-green-600 font-semibold"
                  : "font-semibold"
              }
            >
              {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
            </span>
          </div>

          {/* Free Shipping Progress */}
          {shippingFee > 0 && remainingForFreeShipping > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Mua thêm {formatPrice(remainingForFreeShipping)} để được miễn
                  phí ship
                </span>
                <span>
                  {Math.round((total / freeShippingThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (total / freeShippingThreshold) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {shippingFee === 0 && (
            <Badge
              variant="secondary"
              className="w-full justify-center bg-green-50 text-green-700"
            >
              <Truck className="h-3 w-3 mr-1" />
              🎉 Bạn được miễn phí vận chuyển
            </Badge>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link to="/checkout" className="flex items-center justify-center">
              Tiến hành thanh toán
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link to="/">Tiếp tục mua sắm</Link>
          </Button>
        </div>

        {/* Security & Benefits */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Bảo mật & An toàn</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>Giao hàng nhanh chóng</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Đảm bảo chất lượng</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
