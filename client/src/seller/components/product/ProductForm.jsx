import React, { useState, useEffect } from "react";
import MediaUpload from "./MediaUpload";

const ProductForm = ({ product, onSubmit, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
    videos: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        description: product.description,
        images: product.images,
        videos: product.videos,
      });
      setSelectedImages(product.images);
      setSelectedVideos(product.videos);
    }
  }, [product]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...imageUrls]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    const videoUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedVideos((prev) => [...prev, ...videoUrls]);
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...videoUrls],
    }));
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const removeVideo = (index) => {
    const newVideos = [...selectedVideos];
    newVideos.splice(index, 1);
    setSelectedVideos(newVideos);
    setFormData((prev) => ({ ...prev, videos: newVideos }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên sản phẩm *
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (VNĐ) *
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng *
          </label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh mục *
        </label>
        <select
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Chọn danh mục</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Giày dép">Giày dép</option>
          <option value="Phụ kiện">Phụ kiện</option>
          <option value="Điện tử">Điện tử</option>
        </select>
      </div>

      <MediaUpload
        selectedImages={selectedImages}
        selectedVideos={selectedVideos}
        onImageSelect={handleImageSelect}
        onVideoSelect={handleVideoSelect}
        onRemoveImage={removeImage}
        onRemoveVideo={removeVideo}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả sản phẩm
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Mô tả chi tiết về sản phẩm..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isEditing ? "Cập nhật" : "Thêm sản phẩm"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
