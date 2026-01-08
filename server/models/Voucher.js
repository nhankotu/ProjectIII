import mongoose from "mongoose";

const voucherSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true }, // Số tiền hoặc %
    isPercent: { type: Boolean, default: true }, // true: %, false: VND
    minOrder: { type: Number, default: 0 },
    limit: { type: Number, default: 0 }, // 0 là không giới hạn
    used: { type: Number, default: 0 },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Voucher", voucherSchema);
