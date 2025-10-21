import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -{discount}%
            </Badge>
          )}

          {/* Out of Stock */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-gray-800">
                Hết hàng
              </Badge>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white hover:bg-gray-100"
              onClick={() => onQuickView?.(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          // Tìm đoạn code hiển thị category (khoảng dòng 61)
          {product.category && (
            <p className="text-xs text-gray-500 mb-1">
              {/* ✅ Sửa thành: */}
              {product.category.name || product.category}
            </p>
          )}
          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Add to Cart Button */}
          <Button
            className="w-full"
            size="sm"
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Thêm giỏ hàng" : "Hết hàng"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Format price helper function
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default ProductCard;
