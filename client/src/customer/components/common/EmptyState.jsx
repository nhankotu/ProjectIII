import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Package, Heart, Home } from "lucide-react";

const EmptyState = ({
  type = "default",
  title,
  description,
  actionText,
  onAction,
  className = "",
}) => {
  const config = {
    cart: {
      icon: ShoppingCart,
      title: "Giỏ hàng trống",
      description: "Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm",
      actionText: "Tiếp tục mua sắm",
    },
    search: {
      icon: Search,
      title: "Không tìm thấy kết quả",
      description:
        "Hãy thử tìm kiếm với từ khóa khác hoặc duyệt danh mục sản phẩm",
      actionText: "Xem tất cả sản phẩm",
    },
    products: {
      icon: Package,
      title: "Chưa có sản phẩm",
      description: "Hiện chưa có sản phẩm nào trong danh mục này",
      actionText: "Về trang chủ",
    },
    wishlist: {
      icon: Heart,
      title: "Chưa có sản phẩm yêu thích",
      description: "Hãy thêm sản phẩm vào danh sách yêu thích của bạn",
      actionText: "Khám phá sản phẩm",
    },
    default: {
      icon: Package,
      title: title || "Không có dữ liệu",
      description: description || "Hiện không có dữ liệu để hiển thị",
      actionText: actionText || "Thử lại",
    },
  };

  const {
    icon: Icon,
    title: defaultTitle,
    description: defaultDescription,
    actionText: defaultActionText,
  } = config[type];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {defaultTitle}
      </h3>

      {/* Description */}
      <p className="text-gray-500 max-w-sm mb-6">{defaultDescription}</p>

      {/* Action Button */}
      {onAction && (
        <Button onClick={onAction}>
          <Home className="h-4 w-4 mr-2" />
          {defaultActionText}
        </Button>
      )}
    </div>
  );
};

// Specific empty state components
export const EmptyCart = (props) => <EmptyState type="cart" {...props} />;
export const EmptySearch = (props) => <EmptyState type="search" {...props} />;
export const EmptyProducts = (props) => (
  <EmptyState type="products" {...props} />
);
export const EmptyWishlist = (props) => (
  <EmptyState type="wishlist" {...props} />
);

export default EmptyState;
