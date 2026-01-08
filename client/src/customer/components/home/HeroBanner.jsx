import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  const banners = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 70% Off",
      description: "Don't miss our biggest sale of the year",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Shop Now",
      buttonLink: "/flash-sale",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "New Collection",
      subtitle: "2024 Trends",
      description: "Discover the latest fashion trends",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Explore",
      buttonLink: "/new-arrivals",
      color: "from-pink-500 to-red-600",
    },
    {
      id: 3,
      title: "Free Shipping",
      subtitle: "On All Orders",
      description: "No minimum purchase required",
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Learn More",
      buttonLink: "/shipping",
      color: "from-green-500 to-teal-600",
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
