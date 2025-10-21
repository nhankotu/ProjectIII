import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ProductActions = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product.maxQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    // Có thể thêm toast notification ở đây
    console.log(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect đến checkout page
    // navigate('/checkout');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Có thể thêm logic call API ở đây
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Có thể thêm toast notification
      console.log("Đã copy link vào clipboard");
    }
  };

  const promotions = [
    "Ưu đãi đến 500.000đ khi mở thẻ tín dụng",
    "Giảm thêm 5% cho đơn hàng từ 2 sản phẩm",
    "Trả góp 0% qua thẻ tín dụng",
  ];

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Quantity Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Số lượng</label>
          <div className="flex items-center space-x-3">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-16 text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max={product.maxQuantity || 10}
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (product.maxQuantity || 10)}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <span className="text-sm text-gray-500">
              {product.stock || 100} sản phẩm có sẵn
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex space-x-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Thêm vào giỏ
            </Button>

            <Button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Mua ngay
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={toggleWishlist}
              className="flex-1"
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isWishlisted ? "Đã thích" : "Yêu thích"}
            </Button>

            <Button variant="outline" onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Promotions */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              Khuyến mãi
            </Badge>
            <span>Ưu đãi đặc biệt</span>
          </div>

          <div className="space-y-2">
            {promotions.map((promo, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 text-sm text-gray-600"
              >
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                <span>{promo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Info */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Truck className="h-4 w-4" />
              <span>Vận chuyển</span>
            </div>
            <span className="font-medium">Miễn phí</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Bảo hành</span>
            </div>
            <span className="font-medium">12 tháng</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductActions;
