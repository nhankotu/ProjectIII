import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Tên thương hiệu không nên trùng
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
    },
    description: {
      // Mới: Mô tả thương hiệu (SEO)
      type: String,
      required: false,
    },
    // Mới: Cache số lượng sản phẩm để hiển thị nhanh (VD: Samsung (50))
    productCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Brand", brandSchema);
