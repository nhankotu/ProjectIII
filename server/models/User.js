import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, default: "customer" },
    name: { type: String }, // Tên hiển thị
    phone: { type: String }, // Số điện thoại
    avatar: { type: String }, // URL avatar
    addresses: [
      {
        name: String, // Tên địa chỉ (Nhà riêng, Công ty...)
        phone: String, // Số điện thoại nhận hàng
        address: String, // Địa chỉ chi tiết
        isDefault: { type: Boolean, default: false },
      },
    ],
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
