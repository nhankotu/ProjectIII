import Review from "../../models/Review.js";
import Product from "../../models/Product.js";
import mongoose from "mongoose";

// ============================================================================
// 1. LẤY TOÀN BỘ REVIEW CỦA SHOP (Dùng cho trang Quản lý đánh giá tổng)
// ============================================================================
export const getShopReviews = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { rating, hasReply } = req.query; // Thêm lọc theo việc đã trả lời chưa

    // Lấy list sản phẩm của seller
    const productIds = await Product.find({ sellerId }).distinct("_id");

    let query = { productId: { $in: productIds } };
    if (rating) query.rating = Number(rating);

    // Lọc: hasReply='true' (đã trả lời), 'false' (chưa trả lời)
    if (hasReply === "true")
      query["sellerReply.comment"] = { $exists: true, $ne: "" };
    if (hasReply === "false") query["sellerReply.comment"] = { $exists: false };

    const reviews = await Review.find(query)
      .populate("userId", "username avatar")
      .populate("productId", "name thumbnail")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 2. LẤY REVIEW CỦA 1 SẢN PHẨM (Dùng cho trang Chi tiết sản phẩm)
// ============================================================================
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId, isVisible: true })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 3. TRẢ LỜI ĐÁNH GIÁ (Phản hồi từ Seller)
// ============================================================================
export const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const sellerId = req.user._id;

    // 1. Tìm review và populate sản phẩm để check quyền
    const review = await Review.findById(reviewId).populate("productId");

    if (!review)
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    // 2. Kiểm tra quyền sở hữu
    if (review.productId.sellerId.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền trả lời đánh giá này" });
    }

    // 3. Cập nhật theo cấu trúc Model: sellerReply { comment, createdAt }
    review.sellerReply = {
      comment: comment,
      createdAt: new Date(),
    };

    // Dùng .save() để đảm bảo nếu sau này bạn thêm logic middleware thì nó vẫn chạy
    await review.save();

    res.status(200).json({
      success: true,
      message: "Gửi phản hồi thành công",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 4. THỐNG KÊ TỔNG QUAN CHO SHOP (Dashboard)
// ============================================================================
export const getShopReviewStats = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productIds = await Product.find({ sellerId }).distinct("_id");

    if (productIds.length === 0)
      return res.json({ success: true, data: { avgRating: 0 } });

    const stats = await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                avgRating: { $avg: "$rating" },
                total: { $sum: 1 },
              },
            },
          ],
          starCounts: [{ $group: { _id: "$rating", count: { $sum: 1 } } }],
        },
      },
    ]);

    const overall = stats[0].overall[0] || { avgRating: 0, total: 0 };
    const starCounts = stats[0].starCounts;

    // Map lại để luôn đủ 5 cột sao
    const breakdown = [1, 2, 3, 4, 5].map((star) => {
      const found = starCounts.find((s) => s._id === star);
      return { star, count: found ? found.count : 0 };
    });

    res.json({
      success: true,
      data: {
        avgRating: Math.round(overall.avgRating * 10) / 10,
        totalReviews: overall.total,
        breakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ============================================================================
// 5. THỐNG KÊ ĐÁNH GIÁ CHO TỪNG SẢN PHẨM CỤ THỂ
// ============================================================================
export const getProductReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
          isVisible: true,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tạo mảng mặc định từ 1-5 sao để Frontend dễ vẽ biểu đồ
    const formattedStats = [1, 2, 3, 4, 5].map((star) => {
      const found = stats.find((s) => s._id === star);
      return { star, count: found ? found.count : 0 };
    });

    const totalReviews = formattedStats.reduce((sum, s) => sum + s.count, 0);

    res.json({
      success: true,
      data: {
        totalReviews,
        breakdown: formattedStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
