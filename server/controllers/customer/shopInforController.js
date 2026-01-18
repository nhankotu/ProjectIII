import mongoose from "mongoose";
import ShopSettings from "../../models/ShopSetting.js";
import Product from "../../models/Product.js";

export const getPublicShopInfo = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // 2. Validate ID trước (Tránh lỗi server crash nếu ID bậy bạ)
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Mã cửa hàng không hợp lệ",
      });
    }

    // 3. Chạy song song các truy vấn (Tối ưu tốc độ)
    const [shop, products, totalProducts, shopStats] = await Promise.all([
      // A. Thông tin shop
      ShopSettings.findOne({ sellerId })
        .select("basicInfo policies shipping contact.socialMedia seo createdAt")
        .lean(),

      // B. 10 sản phẩm mới nhất
      Product.find({ sellerId, isDeleted: false, status: "active" })
        .sort({ createdAt: -1 })
        .limit(10)
        .select(
          "name price originalPrice thumbnail slug ratings averageRating sold"
        )
        .lean(),

      // C. Đếm tổng sản phẩm
      Product.countDocuments({ sellerId, isDeleted: false, status: "active" }),

      // D. Tính điểm trung bình (Aggregate)
      Product.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(sellerId),
            isDeleted: false,
            status: "active",
          },
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$averageRating" },
            totalSold: { $sum: "$sold" },
          },
        },
      ]),
    ]);

    // 4. Kiểm tra shop có tồn tại không
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cửa hàng không tồn tại",
      });
    }

    // 5. Xử lý số liệu thống kê (Tránh lỗi null/undefined)
    const stats = shopStats[0] || { avgRating: 0, totalSold: 0 };

    // Đảm bảo avgRating là số trước khi toFixed
    const safeRating = stats.avgRating || 0;

    res.json({
      success: true,
      message: "Lấy thông tin thành công",
      data: {
        shop: {
          ...shop,
          joinedAt: shop.createdAt,
          avgRating: safeRating.toFixed(1), // ✅ Đã an toàn
          totalSold: stats.totalSold || 0,
        },
        products,
        totalProducts,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin shop:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
