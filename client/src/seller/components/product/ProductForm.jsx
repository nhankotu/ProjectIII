import React, { useState, useEffect } from "react";
import MediaUpload from "./MediaUpload";

const ProductForm = ({ product, onSubmit, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // 🆕 1. Thêm State lưu danh mục
  const [categories, setCategories] = useState([]);

  // 🆕 2. Gọi API lấy danh mục từ Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token để xác thực
        const API_URL = import.meta.env.VITE_API_URL;

        const res = await fetch(`${API_URL}/api/seller/categories`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi kèm token vì route này có middleware 'protect'
          },
        });

        const data = await res.json();

        if (data.success) {
          setCategories(data.data);
        } else {
          console.error("Không lấy được danh mục:", data.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Khởi tạo form data từ product (khi edit)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        // Nếu product.category là object (có _id) thì lấy _id, nếu là chuỗi thì lấy nguyên
        category: product.category?._id || product.category || "",
        brand: product.brand?.name || product.brand || "",
        description: product.description || "",
      });
      setSelectedImages(product.images || []);
      setSelectedVideos(product.videos || []);
    } else {
      // Reset form khi thêm mới
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        brand: "",
      });
      setImageFiles([]);
      setVideoFiles([]);
      setSelectedImages([]);
      setSelectedVideos([]);
    }
  }, [product]);

  // ✅ Xử lý chọn ảnh
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    // Tạo URL preview
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...imageUrls]);

    // Reset input
    e.target.value = "";
  };

  // ✅ Xử lý chọn video
  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setVideoFiles((prev) => [...prev, ...files]);

    // Tạo URL preview
    const videoUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedVideos((prev) => [...prev, ...videoUrls]);

    // Reset input
    e.target.value = "";
  };

  // ✅ Xóa ảnh
  const removeImage = (index) => {
    if (selectedImages[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImages[index]);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Xóa video
  const removeVideo = (index) => {
    if (selectedVideos[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(selectedVideos[index]);
    }
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Chuẩn bị dữ liệu
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        category: formData.category, // Bây giờ cái này sẽ là ID (ví dụ: 65a...)
        stock: parseInt(formData.stock) || 0,
        brand: formData.brand.trim(),
        status: "active",
      };

      // Thêm media files (nếu có)
      if (imageFiles.length > 0) {
        productData.images = imageFiles;
      }

      if (videoFiles.length > 0) {
        productData.videos = videoFiles;
      }

      console.log("📦 Submitting product data:", {
        ...productData,
        images: productData.images?.length || 0,
        videos: productData.videos?.length || 0,
      });

      // Gọi callback từ parent component
      if (onSubmit) {
        await onSubmit(productData);
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);
      alert("Có lỗi xảy ra khi gửi form");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Cleanup URLs khi component unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      selectedVideos.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-1"
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Nhập tên sản phẩm"
          disabled={submitting}
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
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
            disabled={submitting}
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
            disabled={submitting}
          />
        </div>
      </div>

      {/* 🆕 3. Phần Select Danh Mục đã được sửa đổi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh mục *
        </label>
        <select
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled={submitting}
        >
          <option value="">Chọn danh mục</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Đang tải danh mục...
            </option>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thương hiệu
        </label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ví dụ: Samsung, Apple (Để trống sẽ là No Brand)"
          disabled={submitting}
        />
      </div>

      {/* Media Upload Component */}
      <MediaUpload
        selectedImages={selectedImages}
        selectedVideos={selectedVideos}
        onImageSelect={handleImageSelect}
        onVideoSelect={handleVideoSelect}
        onRemoveImage={removeImage}
        onRemoveVideo={removeVideo}
        disabled={submitting}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả sản phẩm
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows="4"
          placeholder="Mô tả chi tiết về sản phẩm..."
          disabled={submitting}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {submitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : isEditing ? (
            "Cập nhật sản phẩm"
          ) : (
            "Thêm sản phẩm"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
