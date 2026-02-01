import React from "react";

const MediaUpload = ({
  selectedImages = [],
  selectedVideos = [],
  onImageSelect,
  onVideoSelect,
  onRemoveImage,
  onRemoveVideo,
}) => {
  return (
    <>
      {/* Upload Hình ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hình ảnh sản phẩm
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm text-gray-600">Click để chọn hình ảnh</p>
            <p className="text-xs text-gray-500">Hỗ trợ: JPG, PNG, GIF</p>
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Hình ảnh đã chọn:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video sản phẩm
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={onVideoSelect}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="text-2xl mb-2">🎥</div>
            <p className="text-sm text-gray-600">Click để chọn video</p>
            <p className="text-xs text-gray-500">Hỗ trợ: MP4, MOV</p>
          </label>
        </div>

        {selectedVideos.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Video đã chọn:
            </p>
            <div className="space-y-2">
              {selectedVideos.map((video, index) => (
                <div key={index} className="relative bg-gray-100 p-2 rounded">
                  <video controls className="w-full rounded">
                    <source src={video} type="video/mp4" />
                  </video>
                  <button
                    type="button"
                    onClick={() => onRemoveVideo(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MediaUpload;
