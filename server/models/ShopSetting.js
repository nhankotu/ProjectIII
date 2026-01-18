import mongoose from "mongoose";

const shopSettingsSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    basicInfo: {
      shopName: { type: String, default: "" },
      description: { type: String, default: "" },
      logo: { type: String, default: "" },
      banner: { type: String, default: "" },
      category: { type: String, default: "" },
      establishedYear: { type: Number, default: new Date().getFullYear() },
    },

    policies: {
      returnPolicy: { type: String, default: "" },
      warrantyPolicy: { type: String, default: "" },
      paymentMethods: [{ type: String }],
      processingTime: { type: String, default: "1-2 ngày làm việc" },
      supportTime: { type: String, default: "8:00 - 22:00" },
    },

    shipping: {
      nationwide: { type: Boolean, default: true },
      freeShippingThreshold: { type: Number, default: 0 },
      fixedShippingFee: { type: Number, default: 0 },
      shippingPartners: [
        {
          type: String,
          enum: ["GHTK", "GHN", "VIETTEL", "J&T", "GRAB", "NINJAVAN"],
        },
      ],
      supportedRegions: [{ type: String }],
    },

    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      socialMedia: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        tiktok: { type: String, default: "" },
        zalo: { type: String, default: "" },
      },
    },

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
