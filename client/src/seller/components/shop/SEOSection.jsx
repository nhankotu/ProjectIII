import React, { useState } from "react";

const SEOSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("seo", formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">SEO & Tối ưu tìm kiếm</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Title *
          </label>
          <input
            type="text"
            required
            value={formData.metaTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tên cửa hàng - Mô tả ngắn"
            maxLength="60"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.metaTitle.length}/60 ký tự (Hiển thị trên Google)
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description *
          </label>
          <textarea
            required
            value={formData.metaDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                metaDescription: e.target.value,
              }))
            }
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Mô tả ngắn về cửa hàng, sản phẩm..."
            maxLength="160"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.metaDescription.length}/160 ký tự (Hiển thị trên Google)
          </p>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ khóa SEO
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, keywords: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Phân cách bằng dấu phẩy. Ví dụ: áo thun, thời trang nam, áo phông
          </p>
        </div>

        {/* Custom Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên miền tùy chỉnh
          </label>
          <input
            type="text"
            value={formData.customDomain}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customDomain: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="tencuahang.shop"
          />
          <p className="text-xs text-gray-500 mt-1">
            Kết nối tên miền riêng để chuyên nghiệp hơn
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Đang lưu..." : "Lưu SEO"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SEOSection;
