import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên địa chỉ là bắt buộc"],
      trim: true,
      maxlength: [50, "Tên địa chỉ không quá 50 ký tự"],
    },
    fullName: {
      type: String,
      required: [true, "Họ và tên là bắt buộc"],
      trim: true,
      maxlength: [100, "Họ và tên không quá 100 ký tự"],
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      match: [/^(0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"],
    },
    address: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
      trim: true,
      maxlength: [500, "Địa chỉ không quá 500 ký tự"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
addressSchema.index({ user: 1, isDefault: -1 });
addressSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Address", addressSchema);
