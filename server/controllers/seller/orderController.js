import Order from "../../models/Order.js";

// 📋 Lấy danh sách đơn hàng của Seller
export const getSellerOrders = async (req, res) => {
  try {
    // Lấy ID của người bán đang đăng nhập (từ middleware requireAuth)
    const sellerId = req.user._id;

    console.log("🔍 Đang tìm đơn hàng cho Seller ID:", sellerId);

    // Tìm trong database tất cả đơn hàng có sellerId trùng với người đang đăng nhập
    const orders = await Order.find({ sellerId: sellerId })
      .populate("userId", "name email phone avatar") // Lấy thêm thông tin người mua từ bảng User (dựa vào trường userId trong Model)
      .sort({ createdAt: -1 }); // Sắp xếp đơn mới nhất lên đầu

    console.log(`✅ Tìm thấy ${orders.length} đơn hàng.`);

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};
