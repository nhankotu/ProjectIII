import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "../components/common/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  useFeaturedProducts,
  useHotProducts,
  useBanners,
  useCategories,
  useFlashSales,
} from "../components/hooks/useMockData";
import { useCart } from "../components/hooks/useCart";
import { ArrowRight, Star, Shield, Truck, Clock, Award } from "lucide-react";

const HomePage = () => {
  const featuredProducts = useFeaturedProducts();
  const hotProducts = useHotProducts();
  const banners = useBanners();
  const categories = useCategories();
  const flashSales = useFlashSales();
  const { addToCart } = useCart();

  const [activeBanner, setActiveBanner] = React.useState(0);

  // Auto rotate banners
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!featuredProducts.length) {
    return <LoadingSpinner size="xl" text="Đang tải trang chủ..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeBanner ? "opacity-100" : "opacity-0"
            } ${banner.backgroundColor}`}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-md text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {banner.title}
                </h1>
                <p className="text-xl mb-2">{banner.subtitle}</p>
                <p className="text-lg mb-6 opacity-90">{banner.description}</p>
                <Button asChild size="lg">
                  <Link to={banner.buttonLink}>
                    {banner.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeBanner ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setActiveBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Danh Mục Nổi Bật</h2>
            <Button variant="ghost" asChild>
              <Link to="/categories">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.productCount} sản phẩm
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      {flashSales.map((sale) => (
        <section key={sale.id} className="py-12 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                  <span className="font-bold text-lg">FLASH SALE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Kết thúc sau:</span>
                  <CountdownTimer endTime={sale.endTime} />
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/flash-sale">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {sale.products.map((product) => (
                <Card key={product.id} className="relative overflow-hidden">
                  <CardContent className="p-3">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                    </Link>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.flashPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(product.sold / product.total) * 100}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 text-center">
                        Đã bán {product.sold}/{product.total}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Sản Phẩm Nổi Bật</h2>
            <Button variant="ghost" asChild>
              <Link to="/products">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredProducts.slice(0, 10).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hot Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Sản Phẩm Bán Chạy
            </h2>
            <Button variant="ghost" asChild>
              <Link to="/products?sort=best_seller">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {hotProducts.slice(0, 10).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Truck className="h-8 w-8" />}
              title="Miễn phí vận chuyển"
              description="Cho đơn hàng từ 300.000đ"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Bảo hành chính hãng"
              description="12 tháng toàn quốc"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Hỗ trợ 24/7"
              description="Hotline: 1900 1234"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="Sản phẩm chất lượng"
              description="Cam kết chính hãng 100%"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime) - new Date();
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex space-x-1">
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
};

const TimeUnit = ({ value, label }) => (
  <div className="bg-white rounded-lg p-2 min-w-12 text-center">
    <div className="font-bold text-gray-900">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default HomePage;
