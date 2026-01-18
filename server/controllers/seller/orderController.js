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
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ URL
    const { status } = req.body; // Lấy trạng thái mới từ body (pending, confirmed, shipping...)
    const sellerId = req.user._id; // ID của Seller từ middleware

    console.log(
      `🔄 Seller ${sellerId} yêu cầu cập nhật đơn ${id} sang: ${status}`
    );

    // Tìm và cập nhật: Chỉ cho phép cập nhật đơn hàng thuộc về chính Seller đó
    const order = await Order.findOneAndUpdate(
      { _id: id, sellerId: sellerId },
      { $set: { status: status } },
      { new: true, runValidators: true } // Trả về data sau khi update và kiểm tra hợp lệ
    ).populate("userId", "name email phone avatar");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc bạn không có quyền sửa đơn này",
      });
    }

    console.log(
      `✅ Cập nhật trạng thái thành công cho đơn: ${
        order.orderCode || order._id
      }`
    );

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái",
      error: error.message,
    });
  }
};
