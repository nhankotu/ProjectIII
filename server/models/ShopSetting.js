import mongoose from "mongoose";

const shopSettingsSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🔥 CẬP NHẬT BASIC INFO - THÊM NĂM THÀNH LẬP
    basicInfo: {
      shopName: { type: String, default: "" },
      description: { type: String, default: "" },
      logo: { type: String, default: "" },
      banner: { type: String, default: "" },
      category: { type: String, default: "" },
      establishedYear: { type: Number, default: new Date().getFullYear() }, // 👈 THÊM NÀY
    },

    // 🔥 CẬP NHẬT POLICIES - THÊM THỜI GIAN XỬ LÝ & HỖ TRỢ
    policies: {
      returnPolicy: { type: String, default: "" },
      warrantyPolicy: { type: String, default: "" },
      paymentMethods: [{ type: String }],
      processingTime: { type: String, default: "1-2 ngày làm việc" }, // 👈 THÊM NÀY
      supportTime: { type: String, default: "8:00 - 22:00" }, // 👈 THÊM NÀY
    },

    // 🔥 CẬP NHẬT SHIPPING - THÊM ĐỐI TÁC VẬN CHUYỂN
    shipping: {
      nationwide: { type: Boolean, default: true },
      freeShippingThreshold: { type: Number, default: 0 },
      fixedShippingFee: { type: Number, default: 0 },
      shippingPartners: [
        {
          type: String,
          enum: ["GHTK", "GHN", "VIETTEL", "J&T", "GRAB", "NINJAVAN"], // 👈 THÊM NÀY
        },
      ],
      supportedRegions: [{ type: String }],
    },

    // 🔥 CẬP NHẬT CONTACT - THÊM INSTAGRAM
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      socialMedia: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" }, // 👈 THÊM NÀY
        tiktok: { type: String, default: "" },
        zalo: { type: String, default: "" },
      },
    },

    // SEO (ĐÃ ĐẦY ĐỦ)
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
      customDomain: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ShopSettings", shopSettingsSchema);
