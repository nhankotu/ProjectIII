import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      price: "28.990.000₫",
      originalPrice: "31.990.000₫",
      image: "/api/placeholder/200/200",
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: "24.990.000₫",
      originalPrice: "26.990.000₫",
      image: "/api/placeholder/200/200",
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
    },
    {
      id: 3,
      name: "MacBook Air M2",
      price: "32.990.000₫",
      originalPrice: "35.990.000₫",
      image: "/api/placeholder/200/200",
      rating: 4.9,
      reviewCount: 156,
      inStock: false,
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  const addToCart = (item) => {
    // Logic thêm vào giỏ hàng
    console.log("Thêm vào giỏ:", item);
  };

  const moveAllToCart = () => {
    wishlistItems
      .filter((item) => item.inStock)
      .forEach((item) => addToCart(item));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sản phẩm yêu thích</h1>
            <p className="text-gray-600">
              {wishlistItems.length} sản phẩm trong danh sách yêu thích
            </p>
          </div>

          {wishlistItems.some((item) => item.inStock) && (
            <Button onClick={moveAllToCart} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Thêm tất cả vào giỏ
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Danh sách yêu thích trống
              </h3>
              <p className="text-gray-600 mb-4">
                Hãy thêm sản phẩm bạn yêu thích vào đây!
              </p>
              <Button asChild>
                <a href="/">Mua sắm ngay</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>

                    {!item.inStock && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 left-2"
                      >
                        Hết hàng
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {item.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({item.reviewCount} đánh giá)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">
                        {item.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {item.originalPrice}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        disabled={!item.inStock}
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm giỏ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recently Viewed */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Sản phẩm đã xem gần đây
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-3">
                  <img
                    src="/api/placeholder/120/120"
                    alt={`Product ${item}`}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium line-clamp-2">
                    Sản phẩm mẫu {item}
                  </p>
                  <p className="text-red-600 font-semibold text-sm">
                    1.290.000₫
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
