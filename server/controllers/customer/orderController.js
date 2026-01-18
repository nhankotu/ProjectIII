import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import Review from "../../models/Review.js";
// 📦 TẠO ĐƠN HÀNG (Bản sửa lỗi: Mua món nào thanh toán món đó)
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items: selectedItems } = req.body;
    const userId = req.user._id;

    // 1. Kiểm tra đầu vào từ Frontend
    if (!selectedItems || selectedItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm thanh toán trống." });
    }

    // 2. Gom nhóm sản phẩm theo Seller & Validate trực tiếp từ Database để đảm bảo an toàn
    const itemsBySeller = {};
    const productIds = selectedItems.map((item) => item.product);

    // Lấy thông tin thật từ DB của các sản phẩm khách muốn mua
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    for (const item of selectedItems) {
      const product = dbProducts.find(
        (p) => p._id.toString() === item.product.toString()
      );

      // Validate tính khả dụng
      if (
        !product ||
        product.isDeleted ||
        !product.isActive ||
        product.status !== "active"
      ) {
        return res
          .status(400)
          .json({ message: `Sản phẩm "${item.name}" không còn tồn tại.` });
      }

      // Check tồn kho
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Sản phẩm "${product.name}" không đủ hàng.` });
      }

      const sellerId = product.sellerId.toString();
      if (!itemsBySeller[sellerId]) itemsBySeller[sellerId] = [];

      // Snapshot dữ liệu vào mảng theo từng Seller
      itemsBySeller[sellerId].push({
        product: product._id,
        name: product.name,
        thumbnail: item.thumbnail || product.thumbnail?.url || "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 3. Tạo đơn hàng (Tách đơn theo Seller)
    const orderPromises = Object.keys(itemsBySeller).map(async (sellerId) => {
      const sellerItems = itemsBySeller[sellerId];
      const totalAmount = sellerItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      const newOrder = new Order({
        userId,
        sellerId,
        items: sellerItems,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || "COD",
        status: "pending",
      });

      return newOrder.save();
    });

    const savedOrders = await Promise.all(orderPromises);

    // 4. Trừ tồn kho & Tăng lượt bán (BulkWrite)
    const bulkOps = selectedItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
      },
    }));
    if (bulkOps.length > 0) await Product.bulkWrite(bulkOps);

    // 5. CẬP NHẬT GIỎ HÀNG (Chỉ xóa những món ĐÃ MUA)
    // Thay vì xóa sạch Cart, chúng ta chỉ $pull (kéo) các sản phẩm đã thanh toán ra
    await Cart.updateOne(
      { userId },
      { $pull: { items: { product: { $in: productIds } } } }
    );

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      orderIds: savedOrders.map((o) => o._id),
    });
  } catch (error) {
    console.error("Lỗi đặt hàng:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi đặt hàng", error: error.message });
  }
};

// 📜 LỊCH SỬ ĐƠN HÀNG (Giữ nguyên logic cũ của bạn)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId })
      .populate("sellerId", "username avatar")
      // Thêm populate items.product để lấy slug
      .populate({
        path: "items.product",
        select: "slug",
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// [PATCH] /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    // Tìm đơn hàng và kiểm tra quyền sở hữu
    const order = await Order.findOne({ _id: id, userId: userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể hủy đơn hàng khi shop chưa xác nhận.",
      });
    }

    order.status = "cancelled";
    order.cancelReason = reason || "Người mua tự hủy";
    await order.save();

    // HOÀN LẠI TỒN KHO
    // Dùng Promise.all với findByIdAndUpdate cũng là một cách nếu bulkWrite gây khó hiểu
    const bulkOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity, sold: -item.quantity } },
      },
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    res.json({
      success: true,
      message: "Hủy đơn hàng thành công và đã hoàn tồn kho.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // 1. Tìm đơn hàng (Sử dụng .lean() để có thể chỉnh sửa object trả về)
    const order = await Order.findOne({ _id: id, userId: userId })
      .populate("sellerId", "username avatar")
      .populate("items.product", "slug name thumbnail")
      .lean();

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // 2. 🔥 QUAN TRỌNG: Tìm đánh giá cho từng sản phẩm trong đơn này
    const itemsWithReviews = await Promise.all(
      order.items.map(async (item) => {
        const reviewData = await Review.findOne({
          orderId: order._id,
          productId: item.product._id || item.product, // Linh hoạt giữa object hoặc ID
          userId: userId,
        });

        return {
          ...item,
          isReviewed: !!reviewData, // Trả về true nếu đã đánh giá, false nếu chưa
          reviewData: reviewData || null, // Chứa comment, rating để Frontend hiển thị
        };
      })
    );

    // 3. Gán lại danh sách items đã có thông tin review vào order
    order.items = itemsWithReviews;

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Lỗi getOrderDetail:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
