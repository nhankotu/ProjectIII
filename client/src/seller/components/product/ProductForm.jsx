import React, { useState, useEffect } from "react";
import MediaUpload from "./MediaUpload";

const ProductForm = ({ product, onSubmit, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
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
      });
      setSelectedImages(product.images || []);
      setSelectedVideos(product.videos || []);
    }
  }, [product]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Lưu file thực tế
    setImageFiles((prev) => [...prev, ...files]);

    // Tạo URLs để preview
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...imageUrls]);
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);

    // Lưu file thực tế
    setVideoFiles((prev) => [...prev, ...files]);

    // Tạo URLs để preview
    const videoUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedVideos((prev) => [...prev, ...videoUrls]);
  };

  const removeImage = (index) => {
    // Xóa cả file và preview
    const newImageFiles = [...imageFiles];
    const newImages = [...selectedImages];

    newImageFiles.splice(index, 1);
    newImages.splice(index, 1);

    setImageFiles(newImageFiles);
    setSelectedImages(newImages);
  };

  const removeVideo = (index) => {
    // Xóa cả file và preview
    const newVideoFiles = [...videoFiles];
    const newVideos = [...selectedVideos];

    newVideoFiles.splice(index, 1);
    newVideos.splice(index, 1);

    setVideoFiles(newVideoFiles);
    setSelectedVideos(newVideos);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData để gửi file
    const submitData = new FormData();

    // Thêm các field text
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    submitData.append("category", formData.category);
    submitData.append("description", formData.description);
    submitData.append("status", "pending");

    // Thêm files ảnh
    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    // Thêm files video
    videoFiles.forEach((file) => {
      submitData.append("videos", file);
    });

    console.log("📤 Submitting form with:", {
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
      imageCount: imageFiles.length,
      videoCount: videoFiles.length,
    });

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: submitData, // Gửi FormData
        // KHÔNG set Content-Type header, browser sẽ tự động set
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Product created successfully:", result);
        // Giải phóng URLs tạm thời
        selectedImages.forEach((url) => URL.revokeObjectURL(url));
        selectedVideos.forEach((url) => URL.revokeObjectURL(url));

        onSubmit(result.product);
      } else {
        console.error("❌ Server error:", result);
        alert(result.message || "Có lỗi xảy ra khi thêm sản phẩm");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Không thể kết nối đến server");
    }
  };

  // Hàm xử lý cập nhật sản phẩm (nếu là edit)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Nếu là edit mode, gửi dữ liệu dạng JSON thông thường
    const updateData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      images: selectedImages, // URLs hiện có
      videos: selectedVideos, // URLs hiện có
    };

    console.log("📤 Updating product:", updateData);
    onSubmit(updateData);
  };

  return (
    <form
      onSubmit={isEditing ? handleUpdateSubmit : handleSubmit}
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
