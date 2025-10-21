import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "../components/common/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { useProductDetail } from "../components/hooks/useProductDetail";
import { useProducts } from "../components/hooks/useProducts";
import { useCart } from "../components/hooks/useCart";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, loading, error, relatedProducts } = useProductDetail(id);
  const { addToCart } = useCart();

  if (loading) {
    return <LoadingSpinner size="xl" text="Đang tải thông tin sản phẩm..." />;
  }

  if (error || !product) {
    return (
      <EmptyState
        type="products"
        title="Không tìm thấy sản phẩm"
        description={error || "Sản phẩm bạn tìm kiếm không tồn tại."}
        actionText="Quay lại trang chủ"
        onAction={() => window.history.back()}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Trang chủ
          </Link>
        </Button>
        <span>/</span>
        <Link
          to={`/category/${product.category?.slug}`}
          className="hover:text-blue-600"
        >
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <Card>
            <CardContent className="p-6">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />

              {/* Thumbnail Gallery */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-16 h-16 border rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount} đánh giá)
              </span>
              <span className="text-blue-600">Đã bán {product.soldCount}</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            {product.originalPrice > product.price && (
              <div className="text-sm text-gray-600">
                Tiết kiệm: {formatPrice(product.originalPrice - product.price)}
              </div>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Thêm vào giỏ hàng
              </Button>

              <Button
                disabled={!product.inStock}
                className="flex-1 bg-red-600 hover:bg-red-700"
                size="lg"
              >
                Mua ngay
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Yêu thích
              </Button>

              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Miễn phí vận chuyển cho đơn từ 300.000đ</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Bảo hành {product.warranty}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{product.returnPolicy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
          <TabsTrigger value="reviews">
            Đánh giá ({product.reviewCount})
          </TabsTrigger>
          <TabsTrigger value="shipping">Vận chuyển & Bảo hành</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b pb-2"
                    >
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {product.reviews?.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Đã xác thực
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Vận chuyển</h4>
                  <p className="text-gray-600">{product.shipping}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bảo hành</h4>
                  <p className="text-gray-600">{product.warranty}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Đổi trả</h4>
                  <p className="text-gray-600">{product.returnPolicy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </section>
      )}
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

export default ProductDetailPage;
