import React, { useState } from "react";

const ProductGallery = ({ images, video }) => {
  // ✅ Quản lý media đang được chọn: { type: 'image' | 'video', index: number }
  const [activeMedia, setActiveMedia] = useState({ type: "image", index: 0 });

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "object" && image.url) return image.url;
    return image;
  };

  if ((!images || images.length === 0) && !video?.url) {
    return (
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
        <span className="text-gray-400">No media available</span>
      </div>
    );
  }

  // Lấy URL hiển thị cho phần Main
  const mainMediaUrl =
    activeMedia.type === "video"
      ? video.url
      : getImageUrl(images[activeMedia.index]);

  return (
    <div className="space-y-4">
      {/* --- Main Display (Image or Video) --- */}
      <div className="relative">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] max-h-[500px]">
          {activeMedia.type === "video" ? (
            <video
              src={mainMediaUrl}
              controls
              autoPlay
              muted
              className="w-full h-full object-contain max-h-[500px]"
            />
          ) : (
            <img
              src={mainMediaUrl}
              alt="Product main"
              className="w-full h-auto object-contain"
            />
          )}
        </div>

        {/* Badge hiển thị vị trí */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
            {activeMedia.type === "video"
              ? "Video"
              : `Ảnh ${activeMedia.index + 1}/${images.length}`}
          </div>
        </div>
      </div>

      {/* --- Thumbnail Gallery --- */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {/* Thumbnail của Video (nếu có) */}
        {video?.url && (
          <button
            onClick={() => setActiveMedia({ type: "video", index: 0 })}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 relative transition-all ${
              activeMedia.type === "video"
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            <video
              src={video.url}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <svg
                className="w-8 h-8 text-white shadow-sm"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168l4.2 2.402a.5.5 0 010 .86l-4.2 2.402A.5.5 0 019 12.402V7.598a.5.5 0 01.755-.43z" />
              </svg>
            </div>
          </button>
        )}

        {/* Thumbnail của các Ảnh */}
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveMedia({ type: "image", index })}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              activeMedia.type === "image" && activeMedia.index === index
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            <img
              src={getImageUrl(image)}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex flex-wrap gap-4 pt-2 border-t">
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          <span>Fullscreen</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
