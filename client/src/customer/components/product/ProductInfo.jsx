import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Shield, Truck, Clock, CheckCircle } from "lucide-react";

const ProductInfo = ({ product }) => {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const features = [
    { icon: Shield, text: "Bảo hành 12 tháng" },
    { icon: Truck, text: "Miễn phí vận chuyển" },
    { icon: Clock, text: "Giao hàng trong 24h" },
    { icon: CheckCircle, text: "Chính hãng 100%" },
  ];

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Category & Brand */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {product.category && (
            <>
              <span>{product.category}</span>
              <span>•</span>
            </>
          )}
          {product.brand && <span>{product.brand}</span>}
        </div>

        {/* Product Name */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating || "0.0"} ({product.reviewCount || 0} đánh giá)
          </span>
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            {product.soldCount
              ? `Đã bán ${product.soldCount}`
              : "Chưa có đánh giá"}
          </span>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="destructive" className="text-lg py-1 px-2">
                  -{discount}%
                </Badge>
              </>
            )}
          </div>

          {discount > 0 && (
            <div className="text-sm text-gray-600">
              Tiết kiệm: {formatPrice(product.originalPrice - product.price)}
            </div>
          )}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {features.slice(0, 4).map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <feature.icon className="h-4 w-4 text-green-600" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Stock Status */}
        <div
          className={`text-sm ${
            product.inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.inStock ? "✓ Còn hàng" : "✗ Hết hàng"}
        </div>
      </CardContent>
    </Card>
  );
};

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default ProductInfo;
