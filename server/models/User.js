import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // ================= 1. ĐỊNH DANH (AUTH) =================
    name: {
      type: String,
      required: [true, "Vui lòng nhập họ tên"],
      trim: true,
      maxlength: 50,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
      minlength: [3, "Username phải trên 3 ký tự"],
      match: [
        /^[a-z0-9_]+$/,
        "Username chỉ được chứa chữ thường, số và gạch dưới",
      ],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false,
    },

    // Đăng nhập nhanh bằng Google/Facebook
    googleId: { type: String, index: true },
    facebookId: { type: String, index: true },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/default-avatar.png", // Nên có ảnh mặc định
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"], // Chỉ cho phép 3 giá trị này
      default: "other",
    },
    dateOfBirth: {
      type: Date, // Lưu dạng ngày tháng
      default: null,
    },
    // ================= 2. PHÂN QUYỀN & TRẠNG THÁI =================
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    // Trạng thái tài khoản
    isActive: { type: Boolean, default: true }, // True: Hoạt động, False: Bị khóa
    isEmailVerified: { type: Boolean, default: false }, // Đã xác thực email chưa?

    // ================= 3. TÀI CHÍNH (VÍ & XU) =================
    // Ví tiền thật (Dùng để thanh toán)
    wallet: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Xu thưởng (Loyalty Points)
    points: {
      type: Number,
      default: 0,
    },

    // ================= 4. BẢO MẬT & KHÔI PHỤC =================
    // Token để reset password
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Token xác thực email
    verificationToken: String,

    // Token FCM để bắn thông báo về điện thoại (Mobile App)
    fcmTokens: [String],
  },
  {
    timestamps: true,
  },
);

// --- MIDDLEWARE: TỰ ĐỘNG MÃ HÓA PASSWORD ---
userSchema.pre("save", async function (next) {
  // Nếu password không bị thay đổi (VD chỉ sửa tên), thì bỏ qua hash
  if (!this.isModified("password")) {
    return next();
  }
  // Băm mật khẩu (Hashing)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- METHOD: SO SÁNH PASSWORD KHI LOGIN ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- METHOD: TẠO TOKEN RESET PASSWORD ---
userSchema.methods.getResetPasswordToken = function () {
  // Tạo chuỗi ngẫu nhiên
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash lại token để lưu vào DB (Bảo mật: DB bị lộ cũng ko thấy token thật)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token hết hạn sau 15 phút
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // Trả về token gốc để gửi qua email cho user
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
