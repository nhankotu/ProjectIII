// components/cart/CartItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { CartActions } from "./CartActions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatters";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <Link
            to={`/product/${item.id}`}
            className="flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <img
              src={item.images?.[0] || "/images/placeholder.jpg"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg border"
            />
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <Link
                to={`/product/${item.id}`}
                className="block hover:underline"
              >
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {item.name}
                </h3>
              </Link>
              {item.brand && (
                <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(item.price)}
                </p>
                {item.originalPrice > item.price && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -
                      {Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                )}
              </div>

              {/* Total Price */}
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  {formatPrice(totalPrice)}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <CartActions
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />

              {item.inStock === false && (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-200"
                >
                  Hết hàng
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
