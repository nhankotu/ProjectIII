import React, { useState } from "react";

const ContactSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("contact", formData);
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
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0123.456.789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="support@cuahang.com"
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
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập địa chỉ cửa hàng"
          />
        </div>

        {/* Social Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mạng xã hội
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Facebook
              </label>
              <input
                type="text"
                value={formData.socialMedia?.facebook || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialMedia: {
                      ...prev.socialMedia,
                      facebook: e.target.value,
                    },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Instagram
              </label>
              <input
                type="text"
                value={formData.socialMedia?.instagram || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialMedia: {
                      ...prev.socialMedia,
                      instagram: e.target.value,
                    },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">TikTok</label>
              <input
                type="text"
                value={formData.socialMedia?.tiktok || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialMedia: {
                      ...prev.socialMedia,
                      tiktok: e.target.value,
                    },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="username"
              />
            </div>
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
};

export default ContactSection;
