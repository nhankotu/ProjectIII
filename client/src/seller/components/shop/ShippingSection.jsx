import { forwardRef, useImperativeHandle, useState, useEffect } from "react";

// ✅ CẤU HÌNH MAPPING: Label (hiển thị) - Value (lưu DB)
// Value PHẢI KHỚP 100% với enum trong Model ShopSettings backend
const SHIPPING_PARTNERS = [
  { label: "Giao Hàng Tiết Kiệm (GHTK)", value: "GHTK" },
  { label: "Giao Hàng Nhanh (GHN)", value: "GHN" },
  { label: "Viettel Post", value: "VIETTEL" },
  { label: "J&T Express", value: "J&T" },
  { label: "GrabExpress", value: "GRAB" },
  { label: "Ninja Van", value: "NINJAVAN" },
  // ⚠️ Lưu ý: "Shopee Xpress" không có trong enum backend của bạn,
  // nên tạm thời không đưa vào đây để tránh lỗi validation.
  // Nếu muốn dùng, bạn phải vào Model Backend thêm "SHOPEE" vào enum trước.
];

const ShippingSection = forwardRef(({ data, onSave, isSaving }, ref) => {
  const [shipping, setShipping] = useState({
    partners: [],
    freeShipThreshold: 0,
    ...data,
  });

  useEffect(() => {
    if (data) {
      setShipping({
        partners: [],
        freeShipThreshold: 0,
        ...data,
      });
    }
  }, [data]);

  useImperativeHandle(ref, () => ({
    submit: () => shipping,
  }));

  // Xử lý khi tick chọn (Lưu VALUE vào state, không lưu Label)
  const handleTogglePartner = (partnerValue) => {
    setShipping((prev) => {
      const currentPartners = prev.partners || [];
      if (currentPartners.includes(partnerValue)) {
        // Bỏ chọn
        return {
          ...prev,
          partners: currentPartners.filter((p) => p !== partnerValue),
        };
      } else {
        // Chọn thêm
        return {
          ...prev,
          partners: [...currentPartners, partnerValue],
        };
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-lg font-semibold border-b pb-2">
        🚚 Cấu hình Vận chuyển
      </h2>

      {/* 1. Cấu hình Freeship */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mức hưởng Freeship (VNĐ)
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pl-4"
            placeholder="Ví dụ: 200000"
            value={shipping.freeShipThreshold}
            onChange={(e) =>
              setShipping({
                ...shipping,
                freeShipThreshold: Number(e.target.value),
              })
            }
          />
          <span className="absolute right-3 top-2 text-gray-400 text-sm">
            VNĐ
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Đơn hàng có giá trị trên mức này sẽ được miễn phí vận chuyển. (Nhập 0
          để tắt).
        </p>
      </div>

      {/* 2. Chọn đối tác vận chuyển */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Đơn vị vận chuyển hỗ trợ
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SHIPPING_PARTNERS.map((partner) => (
            <div
              key={partner.value}
              className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                shipping.partners?.includes(partner.value)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              // Truyền Value vào hàm xử lý
              onClick={() => handleTogglePartner(partner.value)}
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                // So sánh Value để check
                checked={shipping.partners?.includes(partner.value) || false}
                readOnly
              />
              <span className="ml-2 text-sm text-gray-700 select-none">
                {/* Hiển thị Label cho đẹp */}
                {partner.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Chọn các đơn vị vận chuyển mà Shop bạn có thể đáp ứng.
        </p>
      </div>
      {/* 👇 THÊM NÚT LƯU Ở CUỐI COMPONENT */}
      <div className="flex justify-end pt-4 border-t mt-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2 text-sm font-medium"
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Đang lưu...
            </>
          ) : (
            "💾 Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
});

export default ShippingSection;
