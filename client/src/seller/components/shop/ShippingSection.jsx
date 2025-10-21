import React, { useState } from "react";

const ShippingSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("shipping", formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Cài đặt vận chuyển</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nationwide Shipping */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="nationwide"
            checked={formData.nationwide}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nationwide: e.target.checked }))
            }
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="nationwide"
            className="text-sm font-medium text-gray-700"
          >
            Hỗ trợ giao hàng toàn quốc
          </label>
        </div>

        {/* Free Shipping Threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngưỡng miễn phí vận chuyển (VNĐ)
          </label>
          <input
            type="number"
            value={formData.freeShippingThreshold}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                freeShippingThreshold: parseInt(e.target.value),
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="300000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Đơn hàng trên {formData.freeShippingThreshold?.toLocaleString()}đ sẽ
            được miễn phí ship
          </p>
        </div>

        {/* Fixed Shipping Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phí vận chuyển cố định (VNĐ)
          </label>
          <input
            type="number"
            value={formData.fixedShippingFee}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fixedShippingFee: parseInt(e.target.value),
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="25000"
          />
        </div>

        {/* Shipping Partners */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đối tác vận chuyển
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["ghtk", "ghn", "viettel", "j&t", "grab", "ninjavan"].map(
              (partner) => (
                <div key={partner} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={partner}
                    checked={formData.shippingPartners?.includes(partner)}
                    onChange={(e) => {
                      const updatedPartners = e.target.checked
                        ? [...(formData.shippingPartners || []), partner]
                        : formData.shippingPartners?.filter(
                            (p) => p !== partner
                          );
                      setFormData((prev) => ({
                        ...prev,
                        shippingPartners: updatedPartners,
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor={partner}
                    className="text-sm text-gray-700 capitalize"
                  >
                    {partner.toUpperCase()}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingSection;
