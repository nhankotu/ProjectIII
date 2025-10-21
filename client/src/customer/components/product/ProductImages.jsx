import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const ProductImages = ({ images, productName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Mock images nếu không có images
  const productImages =
    images && images.length > 0 ? images : ["/images/placeholder-product.jpg"];

  const mainImage = productImages[selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative overflow-hidden aspect-square">
        <div
          className={`relative w-full h-full ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          <img
            src={mainImage}
            alt={productName}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={() => setIsZoomed(!isZoomed)}
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

      {/* Thumbnail Gallery */}
      {productImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${
                selectedImageIndex === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                setSelectedImageIndex(index);
                setIsZoomed(false);
              }}
            >
              <img
                src={image}
                alt={`${productName} - Hình ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="text-sm text-gray-500 text-center">
        Hình {selectedImageIndex + 1} / {productImages.length}
      </div>
    </div>
  );
};

export default ProductImages;
