import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const normalizeImageUrl = (img) => {
  if (!img) return null;

  // string
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    return `${API_BASE_URL}${img}`;
  }

  // object { url }
  if (img.url) {
    if (img.url.startsWith("http")) return img.url;
    return `${API_BASE_URL}${img.url}`;
  }

  return null;
};

const FALLBACK_IMAGE = "/images/placeholder-product.jpg";

const ProductImages = ({ images = [], productName = "" }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  /**
   * Chuẩn hóa & cache danh sách ảnh
   */
  const productImages = useMemo(() => {
    const normalized =
      Array.isArray(images) && images.length > 0
        ? images.map(normalizeImageUrl).filter(Boolean)
        : [];

    return normalized.length > 0 ? normalized : [FALLBACK_IMAGE];
  }, [images]);

  const mainImage = productImages[selectedImageIndex] || productImages[0];

  /**
   * Khi ảnh lỗi → fallback
   */
  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div className="space-y-4">
      {/* ================= MAIN IMAGE ================= */}
      <Card className="relative overflow-hidden aspect-square">
        <div
          className={`relative w-full h-full ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          <img
            src={mainImage}
            alt={productName}
            loading="lazy"
            onError={handleImageError}
            onClick={() => setIsZoomed((prev) => !prev)}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
          />

          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={() => setIsZoomed((prev) => !prev)}
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
            </Button>

            {isZoomed && (
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={() => setIsZoomed(false)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ================= THUMBNAILS ================= */}
      {productImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImageIndex(index);
                setIsZoomed(false);
              }}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${
                selectedImageIndex === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - ${index + 1}`}
                loading="lazy"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ================= COUNTER ================= */}
      <div className="text-sm text-gray-500 text-center">
        Hình {selectedImageIndex + 1} / {productImages.length}
      </div>
    </div>
  );
};

export default ProductImages;
