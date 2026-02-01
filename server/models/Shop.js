import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    // ================= 1. ĐỊNH DANH & CHỦ SỞ HỮU =================
    name: {
      type: String,
      required: [true, "Tên Shop là bắt buộc"],
      unique: true, // Tên shop không được trùng
      trim: true,
      index: "text", // Để tìm kiếm shop
    },
    // Slug để làm URL đẹp: shopee.vn/shop-quan-ao-a
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ================= 2. GIAO DIỆN & THÔNG TIN CƠ BẢN =================
    description: { type: String, maxlength: 2000 },
    logo: { type: String, default: "" }, // Avatar shop
    banner: { type: String, default: "" }, // Ảnh bìa shop

    // Ngành hàng chủ đạo (Thời trang, Điện tử...)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    // ================= 3. TRẠNG THÁI & VẬN HÀNH =================
    status: {
      type: String,
      enum: ["active", "pending", "banned", "vacation"], // Thêm vacation (Tạm nghỉ)
      default: "pending",
      index: true,
    },
    isMall: { type: Boolean, default: false }, // Shop chính hãng (Shopee Mall)

    // Thống kê nhanh
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    followerCount: { type: Number, default: 0 },
    responseRate: { type: Number, default: 100 }, // Tỷ lệ phản hồi chat

    // ================= 4. ĐỊA CHỈ & LIÊN HỆ (Merge từ ShopSettings) =================
    contact: {
      email: { type: String },
      phone: { type: String, required: true },
      // Địa chỉ kho hàng (để Shipper tới lấy)
      address: { type: String, required: true }, // Địa chỉ chi tiết
      province: { type: String }, // Mã Tỉnh/TP (Cho API ship)
      district: { type: String },
      ward: { type: String },

      social: {
        facebook: String,
        instagram: String,
        tiktok: String,
        zalo: String,
      },
    },

    // ================= 5. CẤU HÌNH VẬN CHUYỂN =================
    shippingConfig: {
      // Các đơn vị vận chuyển mà Shop BẬT
      partners: [
        {
          type: String,
          enum: ["GHTK", "GHN", "VIETTEL", "J&T", "GRAB", "NINJAVAN"],
        },
      ],
      // Miễn phí vận chuyển cho đơn từ bao nhiêu tiền?
      freeShipThreshold: { type: Number, default: 0 },
    },

    // ================= 6. CHÍNH SÁCH (Policy) =================
    policies: {
      returnPolicy: {
        type: String,
        default: "Đổi trả trong 3 ngày nếu lỗi NSX",
      },
      warrantyPolicy: { type: String },
      supportTime: { type: String, default: "8:00 - 22:00" },
    },

    // ================= 7. TÀI CHÍNH (Chỉ chủ shop/Admin thấy) =================
    paymentInfo: {
      bankName: String,
      accountNumber: String,
      accountHolder: String,
      swiftCode: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware tạo slug tự động
shopSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString().slice(-4);
  }
  next();
});

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
export default Shop;
