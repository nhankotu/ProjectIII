import mongoose from "mongoose";
import Shop from "../../models/Shop.js";
import Product from "../../models/Product.js";

export const getPublicShopInfo = async (req, res) => {
  try {
    // 1. Nhận Shop ID từ URL (Frontend gửi id của shop, ví dụ: /shop/:id)
    const { sellerId } = req.params; // (Thực chất đây là shopId)

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Mã cửa hàng không hợp lệ",
      });
    }

    const shop = await Shop.findOne({
      $or: [{ _id: sellerId }, { owner: sellerId }],
      status: "active",
    })
      .select("-paymentInfo -updatedAt -__v")
      .populate("owner", "username avatar") // Populate để lấy thông tin user
      .lean();

    // Kiểm tra ngay nếu không thấy Shop
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cửa hàng không tồn tại hoặc đã bị khóa",
      });
    }

    // 🔥 MẤU CHỐT: Lấy User ID (Owner ID) từ shop vừa tìm được
    const ownerId = shop.owner._id;

    // 3. Bây giờ mới dùng ownerId để tìm sản phẩm
    // (Vì Product liên kết với User, không phải liên kết trực tiếp với Shop ID)
    const [products, totalProducts, shopStats] = await Promise.all([
      // A. Sản phẩm
      Product.find({ sellerId: ownerId, status: "active" })
        .sort({ createdAt: -1 })
        .limit(10)
        .select(
          "name price originalPrice thumbnail slug ratingAverage sold stock type"
        )
        .lean(),

      // B. Tổng số lượng
      Product.countDocuments({ sellerId: ownerId, status: "active" }),

      // C. Thống kê Rating/Sold
      Product.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(ownerId), // Dùng ownerId ở đây
            status: "active",
          },
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$ratingAverage" },
            totalSold: { $sum: "$sold" },
          },
        },
      ]),
    ]);

    // 4. Xử lý số liệu hiển thị
    const stats = shopStats[0] || { avgRating: 0, totalSold: 0 };
    const formattedRating = stats.avgRating ? stats.avgRating.toFixed(1) : 0;

    res.json({
      success: true,
      message: "Lấy thông tin Shop thành công",
      data: {
        shop: {
          _id: shop._id,
          name: shop.name,
          slug: shop.slug,
          logo: shop.logo,
          banner: shop.banner,
          description: shop.description,
          isMall: shop.isMall,
          responseRate: shop.responseRate,
          followerCount: shop.followerCount,
          contact: shop.contact,
          policies: shop.policies,
          shippingConfig: {
            partners: shop.shippingConfig?.partners || [],
            freeShipThreshold: shop.shippingConfig?.freeShipThreshold || 0,
          },
          avgRating: formattedRating,
          totalSold: stats.totalSold,
          joinedAt: shop.createdAt,

          // Trả về ownerInfo đầy đủ để Frontend dùng cho Chat
          ownerInfo: {
            _id: shop.owner._id,
            username: shop.owner.username,
            avatar: shop.owner.avatar,
          },
        },
        products,
        totalProducts,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin shop:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};
