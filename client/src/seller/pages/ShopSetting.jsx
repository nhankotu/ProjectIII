// Cập nhật file ShopSettings.jsx - THÊM IMPORT VÀ COMPONENT
import React, { useState } from "react";
import { useShopSettings } from "../hooks/useShopSettings";
import BasicInfoSection from "../components/shop/BasicInfoSection";
import PoliciesSection from "../components/shop/PoliciesSection";
import ShippingSection from "../components/shop/ShippingSection";
import ContactSection from "../components/shop/ContactSection";
import SEOSection from "../components//shop/SEOSection";
import ShopPreview from "../components/shop/ShopPreview";

const ShopSettings = () => {
  const {
    shopData,
    loading,
    saving,
    updateShopData,
    saveAllSettings,
    refetch,
  } = useShopSettings();

  const [saveMessage, setSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState("settings"); // 'settings' or 'preview'

  const handleSectionSave = async (section, data) => {
    const result = await updateShopData(section, data);
    setSaveMessage(result.message);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSaveAll = async () => {
    const result = await saveAllSettings(shopData);
    setSaveMessage(result.message);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải cài đặt cửa hàng...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header với Tabs */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cài đặt cửa hàng
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin và cấu hình cửa hàng của bạn
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span
                className={`text-sm px-3 py-1 rounded ${
                  saveMessage.includes("thành công")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {saveMessage}
              </span>
            )}
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
            >
              {saving ? "Đang lưu..." : "💾 Lưu tất cả"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ⚙️ Cài đặt
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              👁️ Xem trước
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "settings" ? (
        /* Settings Sections */
        <div className="space-y-6">
          <BasicInfoSection
            data={shopData.basicInfo || {}}
            onSave={handleSectionSave}
            saving={saving}
          />

          <PoliciesSection
            data={shopData.policies || {}}
            onSave={handleSectionSave}
            saving={saving}
          />

          <ShippingSection
            data={shopData.shipping || {}}
            onSave={handleSectionSave}
            saving={saving}
          />

          <ContactSection
            data={shopData.contact || {}}
            onSave={handleSectionSave}
            saving={saving}
          />

          <SEOSection
            data={shopData.seo || {}}
            onSave={handleSectionSave}
            saving={saving}
          />

          {/* Preview Note */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Mẹo hữu ích</h4>
            <p className="text-sm text-blue-700">
              Sau khi cập nhật cài đặt, hãy nhấn <strong>"Xem trước"</strong> để
              xem cửa hàng của bạn sẽ hiển thị thế nào cho khách hàng. Thông tin
              chính xác và chuyên nghiệp sẽ giúp tăng độ tin cậy và tỷ lệ chuyển
              đổi.
            </p>
          </div>
        </div>
      ) : (
        /* Shop Preview */
        <ShopPreview shopData={shopData} />
      )}
    </div>
  );
};

export default ShopSettings;
