import Order from "../../models/Order.js";

// ============================================================
// 1. LẤY DANH SÁCH ĐƠN HÀNG (Có Phân trang & Lọc)
// ============================================================
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // --- 1. Lấy tham số từ Query String (URL) ---
    // VD: /orders?page=1&limit=10&status=pending
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // Lọc theo trạng thái (nếu có)
    const skip = (page - 1) * limit;

    // --- 2. Tạo bộ lọc ---
    const filter = { sellerId: sellerId };
    if (status && status !== "all") {
      filter.status = status;
    }

    console.log(
      `🔍 Seller ${sellerId} lấy danh sách đơn. Page: ${page}, Status: ${status || "all"}`,
    );

    // --- 3. Query Database (Chạy song song đếm tổng & lấy data) ---
    const [orders, totalDocs] = await Promise.all([
      Order.find(filter)
        .populate("userId", "name email phone avatar") // Lấy info người mua
        .populate("items.product", "name thumbnail") // Lấy thêm info sản phẩm (tuỳ model của bạn)
        .sort({ createdAt: -1 }) // Mới nhất lên đầu
        .skip(skip)
        .limit(limit)
        .lean(), // Tăng tốc độ query

      Order.countDocuments(filter), // Đếm tổng số đơn để tính số trang
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        totalPages,
        totalDocs,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi lấy đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tải danh sách đơn hàng",
      error: error.message,
    });
  }
};

// ============================================================
// 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Có Validate logic)
// ============================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.user._id;

    // Các trạng thái hợp lệ (Khớp với Enum trong Model Order)
    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    // 1. Tìm đơn hàng trước để check logic
    const order = await Order.findOne({ _id: id, sellerId: sellerId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc bạn không có quyền.",
      });
    }

    // 2. LOGIC CHẶN SỬA ĐỔI (QUAN TRỌNG)
    // Nếu đơn đã huỷ hoặc đã giao thành công, không cho sửa nữa (Tuỳ nghiệp vụ shop bạn)
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng đã ở trạng thái '${order.status}', không thể cập nhật thêm.`,
      });
    }

    // 3. Cập nhật
    order.status = status;

    // Nếu chuyển sang 'delivered', có thể cập nhật luôn thanh toán nếu là COD
    if (status === "delivered") {
      order.paymentStatus = "Paid";
      order.deliveredAt = new Date();
    }

    await order.save(); // Dùng save() để kích hoạt middleware pre-save (nếu có)

    console.log(`✅ Đơn ${id} đã cập nhật sang: ${status}`);

    // Gửi lại data mới nhất
    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
// ============================================================
// 3. LẤY THỐNG KÊ SỐ LƯỢNG ĐƠN HÀNG (API MỚI)
// ============================================================
export const getOrderStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const stats = await Order.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const initialStats = {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    const statsObject = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, initialStats);

    // Tính tổng
    statsObject.total = Object.values(statsObject).reduce((a, b) => a + b, 0);

    res.json({
      success: true,
      data: statsObject,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thống kê đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
