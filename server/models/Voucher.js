import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // null = Voucher Sàn, có ID = Voucher của Shop đó
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Phân loại nguồn gốc: 'shop' hoặc 'platform'
    ownerType: {
      type: String,
      enum: ["shop", "platform"],
      required: true,
      default: function () {
        return this.shopId ? "shop" : "platform";
      },
    },

    type: { type: String, enum: ["fixed", "percent"], default: "fixed" },
    value: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, default: null },
    minOrderValue: { type: Number, required: true, default: 0 },

    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    usageLimitPerUser: { type: Number, default: 1 },
    usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    applyTo: { type: String, enum: ["all", "specific"], default: "all" },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

voucherSchema.index({ code: 1, isActive: 1, endDate: 1 });

export default mongoose.model("Voucher", voucherSchema);
