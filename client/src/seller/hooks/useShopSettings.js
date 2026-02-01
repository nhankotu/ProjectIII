import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export const useShopSettings = () => {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= GET SHOP =================
  const fetchShopData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/seller/shop/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      setShopData(result.data);
    } catch (err) {
      console.error("❌ Fetch shop error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  // ================= UPLOAD IMAGE =================
  const uploadShopImage = async (file, type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const formData = new FormData();

      formData.append("image", file);
      formData.append("type", type);

      const res = await fetch(`${API_BASE}/api/seller/shop/settings/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Upload failed");
      }

      return await res.json();
    } catch (err) {
      console.error("❌ Upload error:", err);
      return { success: false, message: err.message || "Upload failed" };
    }
  };

  // ================= UPDATE SHOP =================
  const updateShop = async (payload) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`${API_BASE}/api/seller/shop/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Update failed");
      }

      const result = await res.json();

      // Cập nhật lại state ngay lập tức để UI đồng bộ
      setShopData(result.data);

      return { success: true, data: result.data };
    } catch (err) {
      console.error("❌ Update error:", err);
      return { success: false, message: err.message };
    } finally {
      setSaving(false);
    }
  };

  return {
    shopData,
    loading,
    saving,
    updateShop,
    uploadShopImage,
    refetch: fetchShopData,
  };
};
