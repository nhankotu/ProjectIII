import ShopSettings from "../../models/ShopSetting.js";
import cloudinary from "../../config/cloudinary.js";

// GET /api/shop/settings - Lấy shop settings
export const getShopSettings = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log("🔄 Fetching shop settings for seller:", sellerId);

    let settings = await ShopSettings.findOne({ sellerId });

    // Nếu chưa có settings, tạo mới với data mặc định theo model mới
    if (!settings) {
      console.log("📝 Creating new shop settings for seller:", sellerId);

      settings = await ShopSettings.create({
        sellerId,
        basicInfo: {
          shopName: `${req.user.username}'s Shop`,
          description: "Mô tả cửa hàng của bạn...",
          category: "Thời trang",
          establishedYear: new Date().getFullYear(), // ✅ Thêm năm thành lập
          logo: "",
          banner: "",
        },
        policies: {
          returnPolicy: "Chấp nhận đổi trả trong 7 ngày",
          warrantyPolicy: "Bảo hành 1 tháng", // ✅ Thêm chính sách bảo hành
          paymentMethods: ["COD", "Chuyển khoản"],
          processingTime: "1-2 ngày làm việc", // ✅ Thêm thời gian xử lý
          supportTime: "8:00 - 22:00", // ✅ Thêm thời gian hỗ trợ
        },
        shipping: {
          nationwide: true,
          freeShippingThreshold: 300000,
          fixedShippingFee: 25000,
          shippingPartners: ["GHTK", "GHN"], // ✅ Thêm đối tác vận chuyển
          supportedRegions: ["Toàn quốc"],
        },
        contact: {
          phone: "",
          email: "",
          address: "",
          socialMedia: {
            facebook: "",
            instagram: "", // ✅ Thêm Instagram
            tiktok: "",
            zalo: "",
          },
        },
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
          customDomain: "",
        },
      });
    }

    console.log("✅ Shop settings found/created:", settings._id);

    res.json({
      success: true,
      message: "Lấy cài đặt cửa hàng thành công",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy shop settings:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy cài đặt cửa hàng",
      error: error.message,
    });
  }
};
// PUT /api/shop/settings - Cập nhật shop settings
export const updateShopSettings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const updateData = req.body;

    console.log("🔄 Updating shop settings for seller:", sellerId);
    console.log("📦 Update data:", updateData);

    // Tìm và cập nhật settings
    const settings = await ShopSettings.findOneAndUpdate(
      { sellerId },
      { $set: updateData },
      {
        new: true, // Trả về document đã update
        upsert: true, // Tạo mới nếu chưa có
        runValidators: true,
      }
    );

    console.log("✅ Shop settings updated:", settings._id);

    res.json({
      success: true,
      message: "Cập nhật cài đặt cửa hàng thành công",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật shop settings:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật cài đặt cửa hàng",
      error: error.message,
    });
  }
};

// POST /api/shop/settings/upload - Upload logo/banner lên Cloudinary
export const uploadShopImage = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { type } = req.body; // 'logo' hoặc 'banner'
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Không có file được tải lên",
      });
    }

    if (!["logo", "banner"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Loại file không hợp lệ. Chỉ chấp nhận 'logo' hoặc 'banner'",
      });
    }

    console.log(`🔄 Uploading ${type} to Cloudinary for seller:`, sellerId);

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `shop-images/${sellerId}`,
      transformation:
        type === "logo"
          ? [{ width: 200, height: 200, crop: "fill", quality: "auto" }]
          : [{ width: 1200, height: 400, crop: "fill", quality: "auto" }],
    });

    // Cập nhật URL vào MongoDB
    const updateField = `basicInfo.${type}`;

    const settings = await ShopSettings.findOneAndUpdate(
      { sellerId },
      { $set: { [updateField]: result.secure_url } },
      { new: true, upsert: true }
    );

    console.log(`✅ ${type} uploaded successfully:`, result.public_id);

    res.json({
      success: true,
      message: `Tải lên ${type} thành công`,
      data: {
        imageUrl: result.secure_url,
        public_id: result.public_id,
        settings,
      },
    });
  } catch (error) {
    console.error(`❌ Lỗi upload ${type}:`, error);
    res.status(500).json({
      success: false,
      message: `Lỗi server khi tải lên ${type}`,
      error: error.message,
    });
  }
};
