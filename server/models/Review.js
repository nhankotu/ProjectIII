import mongoose from "mongoose";
import Product from "./Product.js"; // Import để dùng trong static method

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // --- BỔ SUNG: BIẾN THỂ SẢN PHẨM ---
    // Để hiển thị: "Phân loại hàng: Màu Đỏ, Size L"
    variantSku: { type: String },
    variantName: { type: String },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Vui lòng nhập nội dung đánh giá"],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // --- BỔ SUNG: PHẢN HỒI CỦA SHOP ---
    sellerReply: {
      comment: { type: String, trim: true },
      createdAt: { type: Date },
    },

    // --- BỔ SUNG: HỮU ÍCH (LIKE) & TRẠNG THÁI ---
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách user thấy đánh giá này hữu ích

    isVisible: {
      type: Boolean,
      default: true, // Admin có thể ẩn đánh giá nếu vi phạm tiêu chuẩn cộng đồng
    },
  },
  { timestamps: true }
);

// 1. Index Unique: Một người, mua 1 sản phẩm trong 1 đơn, chỉ được review 1 lần
reviewSchema.index({ orderId: 1, productId: 1 }, { unique: true });

// 2. Index cho Product: Giúp load danh sách review của sản phẩm cực nhanh
reviewSchema.index({ productId: 1, createdAt: -1 });

// =========================================================
// 💡 STATIC METHOD: TỰ ĐỘNG TÍNH ĐIỂM TRUNG BÌNH (AVG RATING)
// =========================================================
reviewSchema.statics.calcAverageRatings = async function (productId) {
  // Dùng Aggregation Pipeline để tính toán
  const stats = await this.aggregate([
    {
      $match: { productId: productId, isVisible: true },
    },
    {
      $group: {
        _id: "$productId",
        nRating: { $sum: 1 }, // Tổng số lượng đánh giá
        avgRating: { $avg: "$rating" }, // Điểm trung bình
      },
    },
  ]);

  // Cập nhật vào bảng Product
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: Math.round(stats[0].avgRating * 10) / 10, // Làm tròn 1 số thập phân (4.5)
      reviewCount: stats[0].nRating,
    });
  } else {
    // Nếu xóa hết review thì reset về 0
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      reviewCount: 0,
    });
  }
};

// Middleware: Gọi hàm tính toán SAU KHI LƯU review mới
reviewSchema.post("save", function () {
  // 'this' trỏ tới review vừa lưu
  // this.constructor trỏ tới Review Model
  this.constructor.calcAverageRatings(this.productId);
});

// Middleware: Gọi hàm tính toán SAU KHI XÓA/SỬA review (nếu dùng findOneAnd...)
// Lưu ý: Nếu bạn dùng findByIdAndUpdate ở Controller, cần setup thêm middleware khác.
// Để đơn giản, khi xóa/sửa review, hãy gọi thủ công Review.calcAverageRatings(productId).

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
