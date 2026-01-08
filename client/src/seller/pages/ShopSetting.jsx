import React, { useState, useEffect, useRef } from "react";
import { useShopSettings } from "../hooks/useShopSettings";
import BasicInfoSection from "../components/shop/BasicInfoSection";
import PoliciesSection from "../components/shop/PoliciesSection";
import ShippingSection from "../components/shop/ShippingSection";
import ContactSection from "../components/shop/ContactSection";
import SEOSection from "../components/shop/SEOSection";
import ShopPreview from "../components/shop/ShopPreview";

const ShopSettings = () => {
  const { shopData, loading, saving, refetch } = useShopSettings();
  const [saveMessage, setSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState("settings");

  const [formData, setFormData] = useState({
    basicInfo: {},
    policies: {},
    shipping: {},
    contact: {},
    seo: {},
  });

  // Refs
  const basicInfoRef = useRef();
  const policiesRef = useRef();
  const shippingRef = useRef();
  const contactRef = useRef();
  const seoRef = useRef();

  // Cập nhật formData khi nhận dữ liệu API
  useEffect(() => {
    if (shopData && !loading) {
      setFormData({
        basicInfo: shopData.basicInfo || {},
        policies: shopData.policies || {},
        shipping: shopData.shipping || {},
        contact: shopData.contact || {},
        seo: shopData.seo || {},
      });
    }
  }, [shopData, loading]);

  // Hàm save từng section (truyền xuống child)
  const handleSectionSave = (sectionKey, updatedData) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: updatedData,
    }));
  };

  // Lưu tất cả section
  const handleSaveAll = async () => {
    setSaveMessage("Đang lưu tất cả...");
    try {
      // Gọi submit của các section có ref
      await basicInfoRef.current?.submit?.();
      await policiesRef.current?.submit?.();
      await shippingRef.current?.submit?.();
      await contactRef.current?.submit?.();
      await seoRef.current?.submit?.();

      setSaveMessage("💾 Lưu tất cả thành công!");
      refetch(); // đồng bộ UI
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("❌ Lỗi khi lưu tất cả:", err);
      setSaveMessage("❌ Lỗi khi lưu tất cả");
      setTimeout(() => setSaveMessage(""), 3000);
    }
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
      {/* Header + Tabs */}
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

      {/* Content */}
      {activeTab === "settings" ? (
        <div className="space-y-6">
          <BasicInfoSection
            ref={basicInfoRef}
            data={formData.basicInfo}
            onSave={handleSectionSave}
            saving={saving}
          />
          <PoliciesSection
            ref={policiesRef}
            data={formData.policies}
            onSave={handleSectionSave}
            saving={saving}
          />
          <ShippingSection
            ref={shippingRef}
            data={formData.shipping}
            onSave={handleSectionSave}
            saving={saving}
          />
          <ContactSection
            ref={contactRef}
            data={formData.contact}
            onSave={handleSectionSave}
            saving={saving}
          />
          <SEOSection
            ref={seoRef}
            data={formData.seo}
            onSave={handleSectionSave}
            saving={saving}
          />
        </div>
      ) : (
        <ShopPreview shopData={formData} />
      )}
    </div>
  );
};

export default ShopSettings;
