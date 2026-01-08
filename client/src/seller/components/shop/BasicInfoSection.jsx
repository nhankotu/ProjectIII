import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useShopSettings } from "../../hooks/useShopSettings";

const BasicInfoSection = forwardRef(({ data, onSave, saving }, ref) => {
  const { uploadShopImage } = useShopSettings();
  const [uploading, setUploading] = useState(false);

  // STATE LOCAL CHỈ CHO UI
  const [tempLogo, setTempLogo] = useState(data?.logo || "");
  const [tempBanner, setTempBanner] = useState(data?.banner || "");
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // CẬP NHẬT PREVIEW KHI data THAY ĐỔI
  useEffect(() => {
    if (data?.logo) setTempLogo(data.logo);
    if (data?.banner) setTempBanner(data.banner);
  }, [data]);

  // Xử lý chọn logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setTempLogo(previewUrl);
    setLogoFile(file);
    e.target.value = "";
  };

  // Xử lý chọn banner
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setTempBanner(previewUrl);
    setBannerFile(file);
    e.target.value = "";
  };

  // Upload ảnh
  const handleImageUpload = async (file, type) => {
    try {
      setUploading(true);
      console.log(`🔄 Starting ${type} upload...`);
      const response = await uploadShopImage(file, type);
      console.log(`✅ Upload ${type} response:`, response);

      if (response && response.success && response.data?.imageUrl) {
        const imageUrl = response.data.imageUrl;
        console.log(`✅ ${type} URL received:`, imageUrl);
        return imageUrl;
      } else {
        console.error(`❌ imageUrl not found in response.data:`, response);
        throw new Error(`Không nhận được URL ảnh ${type} từ server`);
      }
    } catch (error) {
      console.error(`❌ Upload ${type} error:`, error);
      alert(`Lỗi upload ${type}: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Expose hàm submit cho parent
  useImperativeHandle(ref, () => ({
    submit: async () => {
      let finalData = { ...data };

      if (logoFile) {
        const logoUrl = await handleImageUpload(logoFile, "logo");
        if (logoUrl) {
          finalData.logo = logoUrl;
          setTempLogo(logoUrl);
        }
        setLogoFile(null);
      }

      if (bannerFile) {
        const bannerUrl = await handleImageUpload(bannerFile, "banner");
        if (bannerUrl) {
          finalData.banner = bannerUrl;
          setTempBanner(bannerUrl);
        }
        setBannerFile(null);
      }

      await onSave("basicInfo", finalData);
      return finalData;
    },
  }));

  // Nút lưu riêng
  const handleSubmit = async (e) => {
    e.preventDefault();
    await ref.current?.submit();
  };

  // Thay đổi input
  const handleInputChange = (field, value) => {
    const updatedData = { ...data, [field]: value };
    onSave("basicInfo", updatedData);
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
                {tempLogo ? (
                  <img
                    src={tempLogo}
                    alt="Shop logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">📷</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploading || saving}
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
                    uploading || saving
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Chọn logo
                </label>
                {logoFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ Logo mới đã chọn
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner cửa hàng
            </label>
            <div className="flex flex-col space-y-2">
              <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {tempBanner ? (
                  <img
                    src={tempBanner}
                    alt="Shop banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">🖼️</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-upload"
                  disabled={uploading || saving}
                />
                <label
                  htmlFor="banner-upload"
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
                    uploading || saving
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Chọn banner
                </label>
                {bannerFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ Banner mới đã chọn
                  </p>
                )}
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
              value={data?.shopName || ""}
              onChange={(e) => handleInputChange("shopName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập tên cửa hàng"
              disabled={uploading || saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục kinh doanh
            </label>
            <select
              value={data?.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={uploading || saving}
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
            value={data?.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Mô tả về cửa hàng của bạn..."
            disabled={uploading || saving}
          />
          <p className="text-xs text-gray-500 mt-1">
            {(data?.description || "").length}/500 ký tự
          </p>
        </div>

        {/* Established Year */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Năm thành lập
          </label>
          <input
            type="number"
            value={data?.establishedYear || new Date().getFullYear()}
            onChange={(e) =>
              handleInputChange("establishedYear", parseInt(e.target.value))
            }
            min="2000"
            max={new Date().getFullYear()}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={uploading || saving}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {uploading
              ? "📤 Đang upload ảnh..."
              : saving
              ? "💾 Đang lưu..."
              : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default BasicInfoSection;
