import { useState, useEffect } from "react";

export const useShopSettings = () => {
  const [shopData, setShopData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      // Mock data - shop settings
      const mockShopData = {
        // Basic Info
        basicInfo: {
          shopName: "Thời Trang Sara",
          shopLogo: "https://via.placeholder.com/150x150?text=Logo",
          shopBanner: "https://via.placeholder.com/1200x300?text=Banner",
          description:
            "Chuyên cung cấp áo thun unisex chất lượng cao, giá tốt. Cam kết 100% cotton, form chuẩn, đa dạng màu sắc.",
          category: "Thời trang",
          establishedYear: 2023,
        },

        // Policies
        policies: {
          returnPolicy:
            "Chấp nhận đổi trả trong vòng 7 ngày kể từ khi nhận hàng. Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng.",
          warrantyPolicy:
            "Bảo hành 6 tháng cho các lỗi từ nhà sản xuất. Không bảo hành với các trường hợp hư hỏng do người dùng.",
          processingTime: "1-2 ngày làm việc",
          supportTime: "8:00 - 22:00 hàng ngày",
        },

        // Shipping
        shipping: {
          nationwide: true,
          freeShippingThreshold: 300000,
          fixedShippingFee: 25000,
          shippingPartners: ["ghtk", "ghn", "viettel"],
          supportedRegions: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Toàn quốc"],
        },

        // Contact
        contact: {
          phone: "0123.456.789",
          email: "support@thoitrangsara.com",
          address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
          socialMedia: {
            facebook: "thoitrangsara",
            instagram: "thoitrangsara",
            tiktok: "thoitrangsara",
          },
        },

        // SEO
        seo: {
          metaTitle: "Thời Trang Sara - Áo thun unisex chất lượng cao",
          metaDescription:
            "Chuyên áo thun nam nữ chất cotton 100%, form chuẩn, giá tốt. Đổi trả 7 ngày, free ship đơn > 300k.",
          keywords: "áo thun, áo phông unisex, thời trang nam nữ, cotton",
          customDomain: "thoitrangsara.shop",
        },
      };

      setShopData(mockShopData);
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateShopData = async (section, data) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShopData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));

      return { success: true, message: "Cập nhật thành công!" };
    } catch (error) {
      return { success: false, message: "Lỗi khi cập nhật!" };
    } finally {
      setSaving(false);
    }
  };

  const saveAllSettings = async (allData) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShopData(allData);
      return { success: true, message: "Lưu tất cả cài đặt thành công!" };
    } catch (error) {
      return { success: false, message: "Lỗi khi lưu cài đặt!" };
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
    refetch: fetchShopData,
  };
};
