import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  const banners = [
    {
      id: 1,
      // SLIDE 1: Đánh vào sự kết hợp (Sale + Voucher)
      title: "Sale Chồng Sale",
      subtitle: "Giảm thêm 15% bằng Voucher",
      description:
        "Đã rẻ nay còn rẻ hơn! Nhập mã 'SIEUHOT' khi thanh toán các sản phẩm Flash Sale.",
      // Ảnh: Người cầm túi mua sắm vui vẻ hoặc hình ảnh % giảm giá lớn
      image:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Săn Deal & Dùng Mã",
      buttonLink: "/flash-sale",
      color: "from-purple-600 to-blue-600", // Màu tím tạo cảm giác sang trọng/huyền bí
    },
    {
      id: 2,
      // SLIDE 2: Tặng mã Voucher trực tiếp (User nhìn thấy mã là muốn mua)
      title: "Tặng Bạn Mới 50K",
      subtitle: "Voucher: WELCOME2024",
      description:
        "Món quà làm quen! Áp dụng ngay cho đơn hàng đầu tiên tại trang Flash Sale.",
      // Ảnh: Hộp quà hoặc thiệp mời
      image:
        "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Mua Ngay Kẻo Hết",
      buttonLink: "/flash-sale",
      color: "from-pink-500 to-rose-500", // Màu hồng/đỏ tạo sự thân thiện, quà tặng
    },
    {
      id: 3,
      // SLIDE 3: Freeship (Voucher vận chuyển) - Yếu tố chốt đơn quan trọng nhất
      title: "Freeship Đơn 0Đ",
      subtitle: "Miễn phí vận chuyển toàn quốc",
      description:
        "Không lo về giá ship. Chỉ cần chọn món, chúng tôi giao tận nơi miễn phí hôm nay.",
      // Ảnh: Xe giao hàng hoặc hộp hàng
      image:
        "https://images.unsplash.com/photo-1620917290616-e258c729ce92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Đặt Hàng Ngay",
      buttonLink: "/flash-sale",
      color: "from-emerald-500 to-teal-500", // Màu xanh lá tạo cảm giác "tín", an toàn
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000); // Resume autoplay after 10s
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setAutoplay(false);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setAutoplay(false);
  };

  const currentBanner = banners[currentSlide];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl">
      {/* Banner Image */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentBanner.color} opacity-70`}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                {currentBanner.subtitle}
              </span>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {currentBanner.title}
              </h1>

              <p className="text-xl text-white/90 mb-8">
                {currentBanner.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={currentBanner.buttonLink}
                  className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  {currentBanner.buttonText}
                </Link>

                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Timer Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
        <div
          className="h-full bg-white transition-all duration-5000"
          style={{
            width: `${(currentSlide + 1) * (100 / banners.length)}%`,
            transition: autoplay ? "width 5s linear" : "none",
          }}
        />
      </div>
    </div>
  );
};

export default HeroBanner;
