// models/Shop.js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Tên Shop
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết tới bảng User
      required: true,
    },
    description: { type: String },
    logo: { type: String },

    // Trạng thái duyệt của Admin sàn
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "banned"],
      default: "pending", // Mặc định là chờ Admin duyệt
    },

    // Thông tin thanh toán của Seller (để Admin chuyển tiền)
    paymentInfo: {
      bankName: String,
      accountNumber: String,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
