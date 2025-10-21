import React, { useState } from "react";

const BasicInfoSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);
  const [logoPreview, setLogoPreview] = useState(data.shopLogo);
  const [bannerPreview, setBannerPreview] = useState(data.shopBanner);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("basicInfo", formData);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setFormData((prev) => ({ ...prev, shopLogo: previewUrl }));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
      setFormData((prev) => ({ ...prev, shopBanner: previewUrl }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo cửa hàng
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Shop logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
                >
                  Chọn logo
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG (150×150px)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner cửa hàng
            </label>
            <div className="flex flex-col space-y-2">
              <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={bannerPreview}
                  alt="Shop banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
                >
                  Chọn banner
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG (1200×300px)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Name & Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên cửa hàng *
            </label>
            <input
              type="text"
              required
              value={formData.shopName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shopName: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập tên cửa hàng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục kinh doanh
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Thời trang">Thời trang</option>
              <option value="Giày dép">Giày dép</option>
              <option value="Phụ kiện">Phụ kiện</option>
              <option value="Mỹ phẩm">Mỹ phẩm</option>
              <option value="Điện tử">Điện tử</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả cửa hàng
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Mô tả về cửa hàng của bạn..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 ký tự
          </p>
        </div>

        {/* Established Year */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Năm thành lập
          </label>
          <input
            type="number"
            value={formData.establishedYear}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                establishedYear: parseInt(e.target.value),
              }))
            }
            min="2000"
            max="2024"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoSection;
