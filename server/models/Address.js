import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index đơn cho user để query nhanh
    },
    // Tên người nhận hàng (VD: Nguyễn Văn A)
    fullName: {
      type: String,
      required: [true, "Họ và tên là bắt buộc"],
      trim: true,
      maxlength: [100, "Họ và tên không quá 100 ký tự"],
    },
    // Số điện thoại người nhận
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      trim: true,
      // Regex chuẩn hơn cho VN (bắt đầu bằng 0, theo sau là 3,5,7,8,9 và 8 số nữa)
      match: [/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"],
    },

    // --- PHẦN TÁCH ĐỊA CHỈ (QUAN TRỌNG CHO SHIPPING) ---
    // Tỉnh/Thành phố
    province: {
      type: String,
      required: [true, "Tỉnh/Thành phố là bắt buộc"],
      trim: true,
    },
    // Lưu thêm Code của tỉnh (VD: 201) để gửi qua API GHN/GHTK
    provinceCode: {
      type: String,
      default: null,
    },

    // Quận/Huyện
    district: {
      type: String,
      required: [true, "Quận/Huyện là bắt buộc"],
      trim: true,
    },
    districtCode: {
      type: String,
      default: null,
    },

    // Phường/Xã
    ward: {
      type: String,
      required: [true, "Phường/Xã là bắt buộc"],
      trim: true,
    },
    wardCode: {
      type: String,
      default: null,
    },

    // Số nhà, tên đường cụ thể
    detailAddress: {
      type: String,
      required: [true, "Địa chỉ chi tiết là bắt buộc"],
      trim: true,
      maxlength: [200, "Địa chỉ chi tiết không quá 200 ký tự"],
    },
    // ----------------------------------------------------

    // Nhãn địa chỉ (Nhà riêng, Văn phòng) - Thay cho 'name'
    label: {
      type: String,
      enum: ["Nhà riêng", "Văn phòng", "Khác"],
      default: "Nhà riêng",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index compound:
// 1. Tìm địa chỉ mặc định của user nhanh
addressSchema.index({ user: 1, isDefault: -1 });

export default mongoose.model("Address", addressSchema);
