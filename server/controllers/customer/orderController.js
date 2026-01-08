import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

// 📦 TẠO ĐƠN HÀNG
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // 2. Gom nhóm sản phẩm theo Seller & Validate
    const itemsBySeller = {};

    for (const item of cart.items) {
      const product = item.product;

      // 🛠️ VALIDATION QUAN TRỌNG: Check tồn tại, active, delete, status
      if (
        !product ||
        product.isDeleted === true ||
        product.isActive === false ||
        product.status !== "active"
      ) {
        return res.status(400).json({
          message: `Sản phẩm "${
            product?.name || "nào đó"
          }" hiện không khả dụng (đã bị ẩn hoặc xóa). Vui lòng xóa khỏi giỏ hàng.`,
        });
      }

      // Check tồn kho
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ hàng (Còn: ${product.stock}).`,
        });
      }

      // 📸 XỬ LÝ ẢNH SNAPSHOT (Lấy chuỗi URL thay vì object)
      // Để lưu vào lịch sử đơn hàng, tránh sau này sản phẩm bị xóa mất ảnh
      let thumbUrl = "https://via.placeholder.com/150";
      if (product.thumbnail && product.thumbnail.url) {
        thumbUrl = product.thumbnail.url;
      } else if (product.images && product.images.length > 0) {
        thumbUrl = product.images[0].url;
      }

      const sellerId = product.sellerId.toString();

      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = [];
      }

      // Push thông tin "chụp nhanh" (Snapshot) vào đơn hàng
      itemsBySeller[sellerId].push({
        product: product._id,
        name: product.name,
        thumbnail: thumbUrl, // ✅ Lưu String URL
        price: product.price, // Giá tại thời điểm mua
        quantity: item.quantity,
      });
    }

    // 3. Tạo đơn hàng cho từng Seller (Tách đơn)
    const orderPromises = Object.keys(itemsBySeller).map(async (sellerId) => {
      const items = itemsBySeller[sellerId];

      // Tính tổng tiền
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrder = new Order({
        userId,
        sellerId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || "COD",
        status: "pending",
        // createdAt sẽ tự động được tạo
      });

      return newOrder.save();
    });

    const savedOrders = await Promise.all(orderPromises);

    // 4. Trừ tồn kho & Tăng lượt bán
    // Model mới dùng trường 'sold' (khớp với code này)
    const bulkOps = cart.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
      },
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // 5. Xóa giỏ hàng sau khi đặt thành công
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      success: true,
      message: `Đã đặt hàng thành công! (Đơn hàng được tách thành ${savedOrders.length} kiện)`,
      orderIds: savedOrders.map((o) => o._id),
    });
  } catch (error) {
    console.error("Lỗi đặt hàng:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi đặt hàng", error: error.message });
  }
};

// 📜 LỊCH SỬ ĐƠN HÀNG
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate để lấy thêm thông tin shop và slug sản phẩm (để bấm vào xem lại)
    const orders = await Order.find({ userId })
      .populate({
        path: "items.product",
        select: "slug name thumbnail images", // Lấy slug để link tới trang chi tiết
      })
      .populate("sellerId", "username avatar") // Lấy tên Shop
      .sort({ createdAt: -1 });

    // Xử lý dữ liệu trả về (Phòng trường hợp sản phẩm gốc bị xóa)
    const formattedOrders = orders.map((order) => {
      const formatItems = order.items.map((item) => {
        // item.thumbnail là cái snapshot lúc mua (String URL)
        // item.product là dữ liệu live (có thể null nếu SP bị xóa cứng)

        return {
          _id: item._id, // ID của item trong order
          productId: item.product?._id || null,
          name: item.name, // Lấy tên snapshot (an toàn)
          price: item.price, // Lấy giá snapshot (an toàn)
          quantity: item.quantity,
          // Ưu tiên dùng ảnh snapshot lúc mua
          thumbnail: item.thumbnail || "https://via.placeholder.com/150",
          slug: item.product?.slug || "#", // Link slug nếu SP còn tồn tại
        };
      });

      return {
        ...order.toObject(),
        items: formatItems,
      };
    });

    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.error("Lỗi lấy lịch sử đơn:", error);
    res.status(500).json({ message: error.message });
  }
};
