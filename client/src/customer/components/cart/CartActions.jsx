// components/cart/CartActions.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export const CartActions = ({
  item,
  onQuantityChange,
  onRemove,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="h-8 w-8"
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center font-medium text-sm">
          {item.quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(item.quantity + 1)}
          className="h-8 w-8"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Mini Cart Actions for product cards
export const MiniCartActions = ({ onAddToCart, isInCart = false }) => {
  return (
    <Button
      onClick={onAddToCart}
      variant={isInCart ? "secondary" : "default"}
      size="sm"
      className="w-full"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isInCart ? "Đã thêm" : "Thêm giỏ hàng"}
    </Button>
  );
};
