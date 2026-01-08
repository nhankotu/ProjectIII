import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ================= 1. THÔNG TIN CƠ BẢN =================
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      index: "text", // Giúp tìm kiếm nhanh
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String, // HTML content
      required: [true, "Mô tả sản phẩm là bắt buộc"],
    },
    // 🔄 Đổi tên: short_description -> shortDescription
    shortDescription: {
      type: String,
      maxlength: 300,
    },

    // ================= 2. PHÂN LOẠI & LIÊN KẾT =================
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= 3. GIÁ & KHO =================
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // 🔄 Đổi tên: original_price -> originalPrice
    originalPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    // 🔄 Đổi tên: sold_count -> sold (Cho gọn)
    sold: {
      type: Number,
      default: 0,
    },

    // ================= 4. THUỘC TÍNH & TAGS =================
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    tags: [{ type: String, trim: true }],

    // ================= 5. MEDIA (ẢNH & VIDEO) =================
    // Lưu ý: Nếu không có ảnh, FE nên check length hoặc url
    thumbnail: {
      url: String,
      public_id: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    video: {
      url: String,
      public_id: String,
    },

    // ================= 6. ĐÁNH GIÁ & TRẠNG THÁI =================
    // 🔄 Đổi tên: rating_average -> ratingAverage
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // 🔄 Đổi tên: review_count -> reviewCount
    reviewCount: {
      type: Number,
      default: 0,
    },

    // 🔄 Đổi tên: is_active -> isActive
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // 🔄 Đổi tên: is_deleted -> isDeleted
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // ✅ MỚI: Thêm trường Status để quản lý quy trình duyệt
    status: {
      type: String,
      enum: ["active", "pending", "draft", "hidden", "rejected"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware: Tự động tạo Slug trước khi lưu
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

// Ngăn lỗi OverwriteModelError khi hot-reload trong Next.js hoặc Dev mode
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
