import { useEffect, useState, useRef } from "react";
import { useShopSettings } from "../hooks/useShopSettings";

import BasicInfoSection from "../components/shop/BasicInfoSection";
import PoliciesSection from "../components/shop/PoliciesSection";
import ShippingSection from "../components/shop/ShippingSection";
import ContactSection from "../components/shop/ContactSection";
import ShopPreview from "../components/shop/ShopPreview";

const ShopSettings = () => {
  const { shopData, loading, saving, updateShop, uploadShopImage, refetch } =
    useShopSettings();

  const [activeTab, setActiveTab] = useState("settings");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    basicInfo: {},
    policies: {},
    shipping: {},
    contact: {},
  });

  const basicRef = useRef();
  const policiesRef = useRef();
  const shippingRef = useRef();
  const contactRef = useRef();

  // ================= 1. MAP DATA TỪ BACKEND VỀ FRONTEND =================
  useEffect(() => {
    if (!shopData) return;

    // console.log("Data nhận được:", shopData);

    setFormData({
      // Basic Info: Lấy các trường nằm ở root của object shopData
      basicInfo: {
        name: shopData.name || "",
        description: shopData.description || "",
        logo: shopData.logo || "",
        banner: shopData.banner || "",
        category: shopData.category || "",
      },

      // Policies: Khớp trực tiếp
      policies: shopData.policies || {},

      // Shipping: Backend trả về 'shippingConfig', Frontend dùng 'shipping'
      shipping: shopData.shippingConfig || {},

      // Contact: Khớp trực tiếp
      contact: shopData.contact || {},
    });
  }, [shopData]);

  // ================= 2. LƯU DỮ LIỆU (GỬI ĐI) =================
  const handleSaveAll = async () => {
    try {
      setMessage("Đang lưu...");

      // a. Lấy dữ liệu mới nhất từ các component con
      // QUAN TRỌNG: await basicRef vì có upload ảnh
      const basicData = await basicRef.current?.submit();

      if (!basicData) {
        throw new Error("Lỗi khi tải ảnh lên, vui lòng kiểm tra lại.");
      }

      const policies = policiesRef.current?.submit?.() || formData.policies;
      const shipping = shippingRef.current?.submit?.() || formData.shipping;
      const contact = contactRef.current?.submit?.() || formData.contact;

      // b. Gom dữ liệu thành Payload chuẩn Backend
      // Backend của bạn nhận dữ liệu phẳng (flat) ở root cho các trường basic
      const payload = {
        // Bung basicData ra root (name, description, logo, banner...)
        name: basicData.name,
        description: basicData.description,
        logo: basicData.logo,
        banner: basicData.banner,
        category: basicData.category, // Nếu có

        policies,

        // Đổi tên key: Frontend 'shipping' -> Backend 'shippingConfig'
        shippingConfig: shipping,

        contact,
      };

      // c. Gọi API update
      const res = await updateShop(payload);

      if (!res.success) throw new Error(res.message);

      setMessage("✅ Lưu thành công");

      // Cập nhật lại state formData để Preview hiển thị đúng cái mới lưu
      setFormData({
        basicInfo: basicData,
        policies,
        shipping,
        contact,
      });

      refetch();
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ================= XỬ LÝ TAB PREVIEW =================
  const handleSwitchTab = async (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 rounded-full" />
        <span className="ml-2">Đang tải cửa hàng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cài đặt cửa hàng</h1>

        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-sm px-3 py-1 rounded ${
                message.includes("❌")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </span>
          )}

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
          >
            {saving ? (
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

      {/* TABS */}
      <div className="border-b flex gap-6">
        <button
          onClick={() => handleSwitchTab("settings")}
          className={`pb-2 px-1 ${
            activeTab === "settings"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ⚙️ Cài đặt
        </button>

        <button
          onClick={() => handleSwitchTab("preview")}
          className={`pb-2 px-1 ${
            activeTab === "preview"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          👁️ Xem trước trang Shop
        </button>
      </div>

      {/* CONTENT */}
      {activeTab === "settings" ? (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          <BasicInfoSection
            ref={basicRef}
            data={formData.basicInfo}
            uploadImage={uploadShopImage}
            onSave={handleSaveAll}
            isSaving={saving}
          />

          <PoliciesSection
            ref={policiesRef}
            data={formData.policies}
            onSave={handleSaveAll}
            isSaving={saving}
          />
          <ShippingSection
            ref={shippingRef}
            data={formData.shipping}
            onSave={handleSaveAll}
            isSaving={saving}
          />

          {/* Bỏ comment để hiện phần Contact */}
          <ContactSection
            ref={contactRef}
            data={formData.contact}
            onSave={handleSaveAll}
            isSaving={saving}
          />
        </div>
      ) : (
        <ShopPreview data={formData} />
      )}
    </div>
  );
};

export default ShopSettings;
