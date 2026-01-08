import Order from "../../models/Order.js";
import Product from "../../models/A.js";
import mongoose from "mongoose";

const getProductImage = (product) => {
  // 1. Kiểm tra thumbnail là object có url
  if (product?.thumbnail?.url) return product.thumbnail.url;

  // 2. Kiểm tra thumbnail là string
  if (
    typeof product?.thumbnail === "string" &&
    product.thumbnail.startsWith("http")
  )
    return product.thumbnail;

  // 3. Kiểm tra mảng images
  if (Array.isArray(product?.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    // Nếu phần tử đầu là string
    if (typeof firstImg === "string") return firstImg;
    // Nếu phần tử đầu là object có url
    if (firstImg?.url) return firstImg.url;
  }

  // 4. Link dự phòng (Sử dụng placehold.co - ổn định và hiện đại hơn)
  return "https://placehold.co/300x300/e2e8f0/64748b?text=Product+Image";
};

// 📊 Lấy thống kê tổng quan
export const getDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Xác định thời gian hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Doanh thu hôm nay
    // Lưu ý: Trường tổng tiền trong OrderController là 'totalAmount'
    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: "completed", // Hoặc "delivered" tùy quy ước
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }, // 🔄 Sửa: total -> totalAmount
        },
      },
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    // 2. Tổng đơn hàng
    const totalOrders = await Order.countDocuments({ sellerId });

    // 3. Đơn hàng chờ xử lý
    const pendingOrders = await Order.countDocuments({
      sellerId,
      status: { $in: ["pending", "confirmed"] },
    });

    // 4. Sản phẩm sắp hết hàng
    // 🛠️ SỬA: Logic lọc theo Model Product mới
    const lowStockProducts = await Product.countDocuments({
      sellerId,
      stock: { $lte: 10 },
      isActive: true, // Chỉ tính sp đang bán
      isDeleted: false, // Không tính sp đã xóa
      status: "active", // Đã duyệt
    });

    // 5. Tổng số sản phẩm (Hợp lệ)
    const totalProducts = await Product.countDocuments({
      sellerId,
      isDeleted: false,
    });

    // 6. Tỷ lệ chuyển đổi (Sold / (Sold + Stock) hoặc logic view tùy bạn)
    // Ở đây dùng: Tổng đã bán / Tổng sản phẩm active
    let conversionRate = 0;
    if (totalProducts > 0) {
      const soldStats = await Product.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(sellerId),
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            totalSold: { $sum: "$sold" }, // 🔄 Sửa: soldCount -> sold
          },
        },
      ]);

      const totalSold = soldStats[0]?.totalSold || 0;
      // Công thức ví dụ: % sp đã bán được ít nhất 1 cái
      // Hoặc: (Tổng đã bán / Tổng sản phẩm) * 100
      conversionRate = ((totalSold / (totalProducts * 100)) * 100).toFixed(1);
      // *Lưu ý: Công thức conversion rate thực tế thường dựa trên View (Lượt xem),
      // nhưng ở đây ta tính tạm theo số lượng bán.
    }

    res.json({
      todayRevenue,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      totalProducts,
      conversionRate: parseFloat(conversionRate) || 0,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 📦 Lấy đơn hàng gần đây
export const getRecentOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const recentOrders = await Order.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      // 🔄 Sửa: total -> totalAmount
      .select("id items totalAmount status paymentMethod createdAt")
      .populate("userId", "name email"); // Lấy info khách hàng từ User Model nếu có

    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      customer: order.userId?.name || order.shippingAddress?.name || "Khách lạ",
      amount: order.totalAmount, // 🔄 Sửa total -> totalAmount
      status: order.status,
      date: order.createdAt.toISOString().split("T")[0],
      itemsCount: order.items.length,
      paymentMethod: order.paymentMethod,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error getting recent orders:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🔥 Lấy sản phẩm bán chạy (Top Products)
export const getTopProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await Product.find({
      sellerId,
      isDeleted: false,
    })
      .sort({ sold: -1 }) // 🔄 Sửa: soldCount -> sold
      .limit(limit)
      .select("name sold price stock thumbnail images");

    const formattedProducts = topProducts.map((product) => {
      // Tính doanh thu ước tính
      const estimatedRevenue = product.sold * product.price; // 🔄 soldCount -> sold

      return {
        id: product._id,
        name: product.name,
        sales: product.sold, // 🔄 soldCount -> sold
        revenue: estimatedRevenue,
        price: product.price,
        stock: product.stock,
        image: getProductImage(product), // ✅ Dùng hàm helper xử lý ảnh
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error getting top products:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🚀 API Tổng hợp (Dashboard Summary)
export const getDashboardSummary = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const [stats, recentOrders, topProducts] = await Promise.all([
      // 1. Stats
      (async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayRevenueAgg = await Order.aggregate([
          {
            $match: {
              sellerId: new mongoose.Types.ObjectId(sellerId),
              status: "completed",
              createdAt: { $gte: today, $lt: tomorrow },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }, // 🔄 totalAmount
        ]);

        const [totalOrders, pendingOrders, lowStockProducts, totalProducts] =
          await Promise.all([
            Order.countDocuments({ sellerId }),
            Order.countDocuments({
              sellerId,
              status: { $in: ["pending", "confirmed"] },
            }),
            Product.countDocuments({
              sellerId,
              stock: { $lte: 10 },
              isActive: true,
              isDeleted: false,
              status: "active",
            }),
            Product.countDocuments({ sellerId, isDeleted: false }),
          ]);

        // Tính tổng sold
        const soldStats = await Product.aggregate([
          {
            $match: {
              sellerId: new mongoose.Types.ObjectId(sellerId),
              isDeleted: false,
            },
          },
          { $group: { _id: null, totalSold: { $sum: "$sold" } } }, // 🔄 sold
        ]);
        const totalSold = soldStats[0]?.totalSold || 0;

        return {
          todayRevenue: todayRevenueAgg[0]?.total || 0,
          totalOrders,
          pendingOrders,
          lowStockProducts,
          totalProducts,
          totalSold,
        };
      })(),

      // 2. Recent Orders
      Order.find({ sellerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name")
        .lean(),

      // 3. Top Products
      Product.find({ sellerId, isDeleted: false })
        .sort({ sold: -1 }) // 🔄 sold
        .limit(5)
        .select("name sold price thumbnail images")
        .lean(),
    ]);

    // Format Data
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order._id,
      customer:
        order.userId?.name || order.shippingAddress?.name || "Khách hàng",
      amount: order.totalAmount, // 🔄 totalAmount
      status: order.status,
      date: order.createdAt
        ? new Date(order.createdAt).toISOString().split("T")[0]
        : "",
      itemsCount: order.items ? order.items.length : 0,
    }));

    const formattedTopProducts = topProducts.map((product) => ({
      id: product._id,
      name: product.name,
      sales: product.sold, // 🔄 sold
      revenue: product.sold * product.price,
      price: product.price,
      image: getProductImage(product), // ✅ Xử lý ảnh
    }));

    res.json({
      stats,
      recentOrders: formattedRecentOrders,
      topProducts: formattedTopProducts,
    });
  } catch (error) {
    console.error("Error getting dashboard summary:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
