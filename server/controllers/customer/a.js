import ShopSettings from "../models/ShopSetting.js";
import Product from "../models/Product.js"; // Giả sử bạn có model Product để lấy sản phẩm của shop

// ✅ GET /api/customer/shop/:sellerId - Lấy thông tin công khai của shop
export const getPublicShopInfo = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // 1. Tìm thông tin shop (Chỉ lấy các trường cần thiết cho khách hàng)
    // Loại bỏ các thông tin nhạy cảm hoặc không cần thiết nếu có
    const shop = await ShopSettings.findOne({ sellerId })
      .select("basicInfo policies shipping contact seo -_id")
      .lean();

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cửa hàng không tồn tại hoặc chưa được thiết lập",
      });
    }

    // 2. (Tùy chọn) Lấy thêm danh sách sản phẩm mới nhất của shop này
    const products = await Product.find({
      sellerId,
      isDeleted: false,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name price thumbnail slug")
      .lean();

    res.json({
      success: true,
      message: "Lấy thông tin cửa hàng thành công",
      data: {
        shop,
        products, // Trả về kèm sản phẩm để khách hàng xem luôn
      },
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin shop cho khách:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin cửa hàng",
    });
  }
};
