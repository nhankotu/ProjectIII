import Review from "../../models/Review.js";
import Product from "../../models/Product.js";
import mongoose from "mongoose";

// 1. Gộp Tạo & Sửa (Upsert)
export const upsertReview = async (req, res) => {
  try {
    const { orderId, productId, rating, comment, images } = req.body;
    const userId = req.user._id;

    // Tìm xem đã có đánh giá chưa
    let review = await Review.findOne({ orderId, productId, userId });

    if (review) {
      // Nếu có rồi thì CẬP NHẬT
      review.rating = Number(rating);
      review.comment = comment;
      review.images = images || review.images;
      await review.save();
    } else {
      // Nếu chưa có thì TẠO MỚI
      review = await Review.create({
        orderId,
        productId,
        userId,
        rating: Number(rating),
        comment,
        images: images || [],
      });
    }

    // Cập nhật lại Rating trung bình của Sản phẩm
    await updateProductRating(productId);

    res
      .status(200)
      .json({ success: true, data: review, message: "Đã lưu đánh giá!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Xóa Đánh giá
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params; // ID của Review
    const userId = req.user._id;

    const review = await Review.findOneAndDelete({ _id: id, userId });
    if (!review)
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    // Cập nhật lại Rating trung bình của Sản phẩm
    await updateProductRating(review.productId);

    res.json({ success: true, message: "Đã xóa đánh giá" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm bổ trợ tính toán lại rating (để dùng chung)
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: stats[0].avgRating.toFixed(1),
      reviewCount: stats[0].nRating,
    });
  } else {
    // Nếu không còn review nào
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      reviewCount: 0,
    });
  }
}
