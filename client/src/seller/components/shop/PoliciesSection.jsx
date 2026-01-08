import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const PoliciesSection = forwardRef(({ data, onSave, saving }, ref) => {
  const [formData, setFormData] = useState(data || {});

  // Đồng bộ khi data từ parent thay đổi
  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  // Expose submit cho parent
  useImperativeHandle(ref, () => ({
    submit: async () => {
      await onSave("policies", formData);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Chính sách cửa hàng</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Return Policy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chính sách đổi trả
          </label>
          <textarea
            value={formData.returnPolicy || ""}
            onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Mô tả chính sách đổi trả của cửa hàng..."
            disabled={saving}
          />
        </div>

        {/* Warranty Policy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chính sách bảo hành
          </label>
          <textarea
            value={formData.warrantyPolicy || ""}
            onChange={(e) =>
              handleInputChange("warrantyPolicy", e.target.value)
            }
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Mô tả chính sách bảo hành..."
            disabled={saving}
          />
        </div>

        {/* Processing & Support Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian xử lý đơn
            </label>
            <input
              type="text"
              value={formData.processingTime || ""}
              onChange={(e) =>
                handleInputChange("processingTime", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="VD: 1-2 ngày làm việc"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian hỗ trợ
            </label>
            <input
              type="text"
              value={formData.supportTime || ""}
              onChange={(e) => handleInputChange("supportTime", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="VD: 8:00 - 22:00 hàng ngày"
              disabled={saving}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Đang lưu..." : "Lưu chính sách"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default PoliciesSection;
