import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import Review from "../../models/Review.js";

// ==============================================================================
// 📦 1. TẠO ĐƠN HÀNG
// ==============================================================================
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items: selectedItems } = req.body;
    const userId = req.user._id;

    // 1. Validate đầu vào
    if (!selectedItems || selectedItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm thanh toán trống." });
    }

    // 2. Lấy dữ liệu sản phẩm thật từ DB
    const productIds = selectedItems.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    // 3. Gom nhóm sản phẩm theo Seller
    const itemsBySeller = {};
    const bulkOps = []; // Mảng update kho

    for (const item of selectedItems) {
      const product = dbProducts.find(
        (p) => p._id.toString() === item.product.toString(),
      );

      // Nếu sản phẩm không tìm thấy, bỏ qua
      if (!product) continue;

      // Check Active
      const isActive = product.isActive === undefined ? true : product.isActive;
      const isDeleted =
        product.isDeleted === undefined ? false : product.isDeleted;

      if (isDeleted || !isActive || product.status !== "active") {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" hiện không khả dụng.`,
        });
      }

      // 🔥 FIX LOGIC CHECK TỒN KHO & GIÁ (Hỗ trợ Variant)
      let priceToOrder = product.price;
      let stockAvailable = product.stock;

      // Nếu item có biến thể (gửi kèm variant object từ FE)
      if (item.variant && item.variant.sku) {
        const variantInDb = product.variants?.find(
          (v) => v.sku === item.variant.sku,
        );
        if (!variantInDb) {
          return res
            .status(400)
            .json({
              message: `Phân loại hàng "${item.variant.sku}" không tồn tại.`,
            });
        }
        priceToOrder = variantInDb.price;
        stockAvailable = variantInDb.stock;

        // Chuẩn bị lệnh update kho cho Variant
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id, "variants.sku": item.variant.sku },
            update: {
              $inc: {
                "variants.$.stock": -item.quantity,
                sold: +item.quantity,
              },
            },
          },
        });
      } else {
        // Sản phẩm thường -> Update kho gốc
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
          },
        });
      }

      if (stockAvailable < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ hàng (Còn ${stockAvailable}).`,
        });
      }

      const sellerId = product.sellerId.toString();
      if (!itemsBySeller[sellerId]) itemsBySeller[sellerId] = [];

      itemsBySeller[sellerId].push({
        product: product._id,
        name: product.name,
        thumbnail: item.thumbnail || product.thumbnail?.url || "", // Ưu tiên ảnh FE gửi (có thể là ảnh variant)
        price: priceToOrder, // Dùng giá chính xác (variant hoặc gốc)
        quantity: item.quantity,
        variant: item.variant, // Lưu thông tin variant vào Order Item
        sellerId: sellerId,
      });
    }

    // 4. Tạo đơn hàng
    const orderPromises = Object.keys(itemsBySeller).map(async (sellerId) => {
      const sellerItems = itemsBySeller[sellerId];

      const itemsPrice = sellerItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      const shippingPrice = 0;
      const totalAmount = itemsPrice + shippingPrice;

      const finalShippingAddress = {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        detailAddress: shippingAddress.address || "N/A",
        ward: shippingAddress.ward || "Không xác định",
        district: shippingAddress.district || "Không xác định",
        province:
          shippingAddress.city || shippingAddress.province || "Không xác định",
      };

      const newOrder = new Order({
        userId,
        sellerId,
        items: sellerItems,
        itemsPrice,
        shippingPrice,
        totalAmount,
        shippingAddress: finalShippingAddress,
        paymentMethod: paymentMethod || "COD",
        status: "pending",
      });

      return newOrder.save();
    });

    const savedOrders = await Promise.all(orderPromises);

    // 5. Thực thi trừ tồn kho
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // 6. Xóa sản phẩm đã mua khỏi Giỏ hàng
    await Cart.updateOne(
      { userId },
      { $pull: { items: { product: { $in: productIds } } } },
    );

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      orderIds: savedOrders.map((o) => o._id),
    });
  } catch (error) {
    console.error("❌ Lỗi tạo đơn:", error);
    res.status(500).json({
      message: "Lỗi tạo đơn hàng",
      error: error.message,
    });
  }
};

// ==============================================================================
// 📜 2. LỊCH SỬ ĐƠN HÀNG (Giữ nguyên)
// ==============================================================================
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId })
      .populate("sellerId", "username avatar")
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

// ==============================================================================
// 🚫 3. HỦY ĐƠN HÀNG (Giữ nguyên)
// ==============================================================================
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

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

    // Hoàn lại tồn kho
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

// ==============================================================================
// 📄 4. CHI TIẾT ĐƠN HÀNG (Giữ nguyên)
// ==============================================================================
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, userId: userId })
      .populate("sellerId", "username avatar")
      .populate("items.product", "slug name thumbnail")
      .lean();

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // Map thông tin review
    const itemsWithReviews = await Promise.all(
      order.items.map(async (item) => {
        const reviewData = await Review.findOne({
          orderId: order._id,
          productId: item.product?._id || item.product,
          userId: userId,
        });

        return {
          ...item,
          isReviewed: !!reviewData,
          reviewData: reviewData || null,
        };
      }),
    );

    order.items = itemsWithReviews;

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Lỗi getOrderDetail:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
