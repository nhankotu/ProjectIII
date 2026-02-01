import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";

const RegistrationModal = ({
  isOpen,
  onClose,
  onSubmit,
  events,
  products,
  initialEventId = "",
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    flashSaleId: "",
    productId: "",
    salePrice: "",
    limitQuantity: "",
  });

  // Khi modal mở hoặc initialEventId thay đổi -> reset form
  useEffect(() => {
    if (isOpen) {
      setFormData({
        flashSaleId: initialEventId || "",
        productId: "",
        salePrice: "",
        limitQuantity: "",
      });
    }
  }, [isOpen, initialEventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Đăng ký tham gia Flash Sale
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Select Sự kiện */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn khung giờ
            </label>
            <select
              name="flashSaleId"
              value={formData.flashSaleId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            >
              <option value="">-- Chọn sự kiện --</option>
              {events.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({new Date(c.startTime).getHours()}h -{" "}
                  {new Date(c.endTime).getHours()}h)
                </option>
              ))}
            </select>
          </div>

          {/* Select Sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn sản phẩm
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (Gốc: {p.price?.toLocaleString()}đ)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá Flash Sale
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="VD: 99000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng bán
              </label>
              <input
                type="number"
                name="limitQuantity"
                value={formData.limitQuantity}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="VD: 50"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg flex gap-3 border border-blue-100">
            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Lưu ý: Giá Sale phải thấp hơn giá gốc. Số lượng đăng ký sẽ được
              trừ vào kho tạm thời khi sự kiện bắt đầu.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-sm"
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
