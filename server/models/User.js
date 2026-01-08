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
    role: {
      type: String,
      enum: ["customer", "seller", "admin"], // Chỉ cho phép 3 quyền này
      default: "customer",
    },
    // Thêm trường này để check nhanh xem user này có bị khóa không
    isActive: { type: Boolean, default: true },
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
