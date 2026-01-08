import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const ContactSection = forwardRef(({ data, onSave, saving }, ref) => {
  const [formData, setFormData] = useState(data || {});

  // Đồng bộ khi data từ parent thay đổi
  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  // Expose submit cho parent
  useImperativeHandle(ref, () => ({
    submit: async () => {
      await onSave("contact", formData);
      return formData;
    },
  }));

  // Nút lưu riêng
  const handleSubmit = async (e) => {
    e.preventDefault();
    await ref.current?.submit();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone & Email */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              required
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0123.456.789"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="support@cuahang.com"
              disabled={saving}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập địa chỉ cửa hàng"
            disabled={saving}
          />
        </div>

        {/* Social Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mạng xã hội
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {["facebook", "instagram", "tiktok"].map((platform) => (
              <div key={platform}>
                <label className="block text-xs text-gray-500 mb-1">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <input
                  type="text"
                  value={formData.socialMedia?.[platform] || ""}
                  onChange={(e) => handleSocialChange(platform, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="username"
                  disabled={saving}
                />
              </div>
            ))}
          </div>
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
});

export default ContactSection;
