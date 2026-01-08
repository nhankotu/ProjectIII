import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export const useShopSettings = () => {
  const [shopData, setShopData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      console.log("🔄 Fetching shop settings from API...");

      const response = await fetch(`${API_BASE}/api/seller/settings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 API Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Shop data received:", result.data);
        setShopData(result.data || {});
      } else {
        console.error("❌ Failed to fetch shop settings");
        setShopData({});
      }
    } catch (error) {
      console.error("❌ Error fetching shop data:", error);
      setShopData({});
    } finally {
      setLoading(false);
    }
  };

  // ✅ THÊM HÀM UPLOAD ẢNH
  const uploadShopImage = async (file, type) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vui lòng đăng nhập lại");
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      console.log(`📤 Uploading ${type}...`);

      const response = await fetch(`${API_BASE}/api/seller/settings/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 🔥 KHÔNG set Content-Type cho FormData - browser sẽ tự set
        },
        body: formData,
      });

      const result = await response.json();
      console.log("📡 Upload response from server:", result);

      // 🔥 QUAN TRỌNG: Trả về result GỐC từ server, không thay đổi cấu trúc
      return result;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      // 🔥 Trả về response error đúng cấu trúc
      return {
        success: false,
        message: "Lỗi kết nối server khi upload ảnh",
        error: error.message,
      };
    }
  };
  const updateShopData = async (section, data) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { success: false, message: "Vui lòng đăng nhập lại" };
      }

      console.log(`🔄 Updating ${section}:`, data);

      const updatePayload = {
        [section]: data,
      };

      const response = await fetch(`${API_BASE}/api/seller/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const result = await response.json();
      console.log("📡 Update response:", result);

      if (result.success) {
        setShopData((prev) => ({
          ...prev,
          [section]: { ...prev[section], ...data },
        }));

        return {
          success: true,
          message: result.message || "Cập nhật thành công!",
        };
      } else {
        return {
          success: false,
          message: result.message || "Lỗi khi cập nhật!",
        };
      }
    } catch (error) {
      console.error("❌ Error updating shop data:", error);
      return {
        success: false,
        message: "Lỗi kết nối server!",
      };
    } finally {
      setSaving(false);
    }
  };

  const saveAllSettings = async (allData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { success: false, message: "Vui lòng đăng nhập lại" };
      }

      console.log("💾 Saving all settings:", allData);

      const response = await fetch(`${API_BASE}/api/seller/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allData),
      });

      const result = await response.json();
      console.log("📡 Save all response:", result);

      if (result.success) {
        setShopData(allData);
        return {
          success: true,
          message: result.message || "Lưu tất cả cài đặt thành công!",
        };
      } else {
        return {
          success: false,
          message: result.message || "Lỗi khi lưu cài đặt!",
        };
      }
    } catch (error) {
      console.error("❌ Error saving all settings:", error);
      return {
        success: false,
        message: "Lỗi kết nối server!",
      };
    } finally {
      setSaving(false);
    }
  };

  return {
    shopData,
    loading,
    saving,
    updateShopData,
    saveAllSettings,
    uploadShopImage, // 👈 THÊM HÀM MỚI
    refetch: fetchShopData,
  };
};
