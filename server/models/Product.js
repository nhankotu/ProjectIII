import mongoose from "mongoose";

// --- SCHEMA BIẾN THỂ (SKU) ---
const productVariantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, default: 0 },

    options: {
      type: Object,
      default: {},
    },

    image: { url: String, public_id: String },
  },
  { _id: false },
);

// --- SCHEMA CHÍNH ---
const productSchema = new mongoose.Schema(
  {
    // ================= 1. THÔNG TIN CƠ BẢN =================
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      index: "text",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },

    // ================= 2. PHÂN LOẠI =================
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
      index: true,
    },

    // ================= 3. GIÁ & BIẾN THỂ (QUAN TRỌNG) =================
    type: {
      type: String,
      enum: ["simple", "variable"],
      default: "simple",
    },

    // Nếu là Simple Product thì dùng giá và kho ở đây
    price: { type: Number, min: 0 },
    originalPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0 },

    // Nếu là Variable Product thì dùng mảng variants
    variants: [productVariantSchema],

    variantAttributes: [
      {
        name: String,
        values: [String],
      },
    ],

    // ================= 4. VẬN CHUYỂN (BẮT BUỘC CHO API SHIP) =================
    shipping: {
      weight: { type: Number, required: true },
      height: { type: Number, default: 0 },
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
    },

    // ================= 5. THÔNG SỐ KỸ THUẬT =================

    specifications: [
      {
        name: String, // VD: "RAM"
        value: String, // VD: "8GB"
      },
    ],

    // ================= 6. MEDIA & THỐNG KÊ =================
    thumbnail: { url: String, public_id: String },
    images: [{ url: String, public_id: String }],
    video: { url: String, public_id: String },

    ratingAverage: { type: Number, default: 0, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0 },
    sold: { type: Number, default: 0, index: true },

    // ================= 7. TRẠNG THÁI =================

    status: {
      type: String,
      enum: ["active", "draft", "hidden", "rejected", "deleted", "pending"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Middleware: Tạo Slug + Random string ngắn để tránh trùng lặp 100%
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    const baseSlug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

    this.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  if (this.type === "variable" && this.variants && this.variants.length > 0) {
    // Cộng dồn stock của tất cả variant
    const totalStock = this.variants.reduce((sum, variant) => {
      return sum + (variant.stock || 0);
    }, 0);

    this.stock = totalStock;
  }
  next();
});
//khoang gia tri giu cac bien the
productSchema.virtual("priceRange").get(function () {
  if (this.type === "variable" && this.variants.length > 0) {
    const prices = this.variants.map((v) => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
  return null;
});
productSchema.index({ name: "text", shortDescription: "text" });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
