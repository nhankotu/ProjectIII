import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import mongoose from "mongoose";

// --- HELPER: Xử lý ảnh sản phẩm an toàn ---
const getProductImage = (product) => {
  if (product.thumbnail?.url) return product.thumbnail.url;
  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    return (
      firstImg?.url || firstImg || "https://placehold.co/300x300?text=No+Image"
    );
  }
  return "https://placehold.co/300x300?text=No+Image";
};

// --- HELPER: Lấy giá hiển thị (Xử lý Simple vs Variable) ---
const getProductDisplayPrice = (product) => {
  if (
    product.type === "variable" &&
    Array.isArray(product.variants) &&
    product.variants.length > 0
  ) {
    return product.variants[0]?.price || 0;
  }
  return product.price || 0;
};

// 📊 1. Lấy thống kê tổng quan (Stats)
export const getDashboardStats = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    // Thời gian: Đầu ngày hôm nay -> Đầu ngày mai
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // --- AGGREGATION: Tính toán song song để tối ưu ---
    const [revenueStats, orderCounts, productStats] = await Promise.all([
      // A. Doanh thu hôm nay (Chỉ tính đơn đã giao thành công - delivered)
      Order.aggregate([
        {
          $match: {
            sellerId,
            status: "delivered", // Khớp với Enum trong Order Model
            createdAt: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      // B. Đếm số lượng đơn hàng
      Order.aggregate([
        { $match: { sellerId } },
        {
          $facet: {
            total: [{ $count: "count" }],
            pending: [
              { $match: { status: { $in: ["pending", "confirmed"] } } }, // Đơn cần xử lý
              { $count: "count" },
            ],
          },
        },
      ]),

      // C. Thống kê sản phẩm (Khớp với Product Model status)
      Product.aggregate([
        { $match: { sellerId, status: { $ne: "deleted" } } }, // Không tính sp đã xóa
        {
          $facet: {
            total: [{ $count: "count" }],
            lowStock: [
              {
                $match: {
                  status: "active", // Chỉ tính sp đang bán
                  // Logic đơn giản: Check stock cha (với sp simple).
                  // Với sp variable, logic check stock phức tạp hơn, tạm thời bỏ qua hoặc cần query sâu vào variants.
                  stock: { $lte: 10 },
                  type: "simple",
                },
              },
              { $count: "count" },
            ],
            soldRate: [{ $group: { _id: null, totalSold: { $sum: "$sold" } } }],
          },
        },
      ]),
    ]);

    // --- FORMAT DATA ---
    const todayRevenue = revenueStats[0]?.total || 0;
    const totalOrders = orderCounts[0]?.total[0]?.count || 0;
    const pendingOrders = orderCounts[0]?.pending[0]?.count || 0;

    const totalProducts = productStats[0]?.total[0]?.count || 0;
    const lowStockProducts = productStats[0]?.lowStock[0]?.count || 0;
    const totalSold = productStats[0]?.soldRate[0]?.totalSold || 0;

    // Tính tỷ lệ bán hàng (Sell-through rate) = Đã bán / (Đã bán + Tồn kho hiện tại)
    // Hoặc đơn giản là Average Sold per Product
    let conversionRate = 0;
    if (totalProducts > 0) {
      conversionRate = (totalSold / totalProducts).toFixed(1);
    }

    res.json({
      todayRevenue,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      totalProducts,
      conversionRate, // Trả về trung bình số lượng bán/sp (VD: 5.2 cái/sp)
    });
  } catch (error) {
    console.error("Error dashboard stats:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
  }
};

// 📦 2. Lấy đơn hàng gần đây
export const getRecentOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const recentOrders = await Order.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        "totalAmount status paymentMethod createdAt shippingAddress userId items",
      ) // Chọn field cần thiết
      .populate("userId", "name email") // Lấy tên user nếu có
      .lean(); // Dùng lean() để convert sang Plain Object ngay lập tức -> Nhanh hơn

    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      // Ưu tiên tên user login -> tên người nhận -> default
      customer:
        order.userId?.name ||
        order.shippingAddress?.fullName ||
        "Khách vãng lai",
      amount: order.totalAmount,
      status: order.status,
      date: order.createdAt
        ? new Date(order.createdAt).toISOString().split("T")[0]
        : "N/A",
      itemsCount: order.items?.length || 0,
      paymentMethod: order.paymentMethod,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error recent orders:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🔥 3. Lấy sản phẩm bán chạy (Top Products)
export const getTopProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    // Lấy sp chưa bị xóa (bao gồm cả active, hidden...)
    const topProducts = await Product.find({
      sellerId,
      status: { $ne: "deleted" },
    })
      .sort({ sold: -1 }) // Sort theo field 'sold' (đã đánh index)
      .limit(limit)
      .select("name sold price stock thumbnail images type variants") // Lấy thêm type và variants để check giá
      .lean();

    const formattedProducts = topProducts.map((product) => {
      const displayPrice = getProductDisplayPrice(product);
      const estimatedRevenue = product.sold * displayPrice;

      return {
        id: product._id,
        name: product.name,
        sales: product.sold,
        revenue: estimatedRevenue,
        price: displayPrice,
        // Nếu là variable, stock ở root có thể = 0, cần cộng tổng variants (nếu muốn chính xác)
        // Nhưng ở đây hiển thị nhanh nên lấy stock root (nếu bạn có sync) hoặc để N/A
        stock:
          product.type === "variable"
            ? product.variants.reduce((acc, curr) => acc + curr.stock, 0)
            : product.stock,
        image: getProductImage(product),
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error top products:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🚀 4. API Tổng hợp (Dashboard Summary - Gọi 1 lần lấy hết)
export const getDashboardSummary = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Xử lý thời gian (Giữ nguyên logic new Date() của bạn để khớp với server time hiện tại)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 2. Query song song
    const [orderStats, productStats, recentOrdersRaw, topProductsRaw] =
      await Promise.all([
        // --- A. Thống kê Đơn hàng & Doanh thu ---
        Order.aggregate([
          { $match: { sellerId } },
          {
            $facet: {
              revenue: [
                {
                  $match: {
                    status: "delivered",
                    createdAt: { $gte: today, $lt: tomorrow },
                  },
                },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
              ],
              counts: [
                {
                  $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                      $sum: {
                        $cond: [
                          { $in: ["$status", ["pending", "confirmed"]] },
                          1,
                          0,
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ]),

        // --- B. Thống kê Sản phẩm (NÂNG CẤP LOGIC LOW STOCK) ---
        Product.aggregate([
          { $match: { sellerId, status: { $ne: "deleted" } } },
          {
            $facet: {
              total: [{ $count: "count" }],
              lowStock: [
                {
                  $match: {
                    status: "active",
                    // 🔥 LOGIC MỚI: Check cả Simple và Variable
                    $or: [
                      { type: "simple", stock: { $lte: 10 } },
                      {
                        type: "variable",
                        variants: { $elemMatch: { stock: { $lte: 10 } } }, // Quét vào mảng variants
                      },
                    ],
                  },
                },
                { $count: "count" },
              ],
              sold: [{ $group: { _id: null, total: { $sum: "$sold" } } }],
            },
          },
        ]),

        // --- C. Đơn hàng gần đây ---
        Order.find({ sellerId })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("totalAmount status createdAt shippingAddress userId items")
          .populate("userId", "name email") // Lấy thêm email để fallback tên
          .lean(),

        // --- D. Sản phẩm bán chạy ---
        Product.find({ sellerId, status: { $ne: "deleted" } })
          .sort({ sold: -1 })
          .limit(5)
          .select("name sold price thumbnail images type variants stock")
          .lean(),
      ]);

    // --- 3. FORMAT DATA (QUAN TRỌNG: Mapping y hệt cấu trúc cũ) ---

    // Xử lý Stats (Thêm fallback || 0 để không null)
    const statsData = {
      todayRevenue: orderStats[0]?.revenue?.[0]?.total || 0,
      totalOrders: orderStats[0]?.counts?.[0]?.total || 0,
      pendingOrders: orderStats[0]?.counts?.[0]?.pending || 0,
      totalProducts: productStats[0]?.total?.[0]?.count || 0,
      lowStockProducts: productStats[0]?.lowStock?.[0]?.count || 0,
    };

    // Tính conversionRate (Giữ nguyên tên key này để FE không lỗi)
    const totalSoldVal = productStats[0]?.sold?.[0]?.total || 0;
    statsData.conversionRate =
      statsData.totalProducts > 0
        ? (totalSoldVal / statsData.totalProducts).toFixed(1)
        : 0;

    // Xử lý Recent Orders (Format date thành string YYYY-MM-DD như cũ)
    const recentOrders = recentOrdersRaw.map((o) => ({
      id: o._id,
      customer:
        o.userId?.name ||
        o.shippingAddress?.fullName ||
        o.userId?.email ||
        "Khách lạ",
      amount: o.totalAmount,
      status: o.status,
      // ⚠️ Giữ nguyên logic split string này để FE hiển thị đúng format cũ
      date: o.createdAt
        ? new Date(o.createdAt).toISOString().split("T")[0]
        : "N/A",
      itemsCount: o.items?.length || 0,
    }));

    // Xử lý Top Products (Tính toán lại Revenue & Stock chuẩn hơn)
    const topProducts = topProductsRaw.map((p) => {
      const displayPrice = getProductDisplayPrice(p);

      // Tính tổng tồn kho nếu là variable
      let currentStock = p.stock;
      if (p.type === "variable" && Array.isArray(p.variants)) {
        currentStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      }

      return {
        id: p._id,
        name: p.name,
        sales: p.sold || 0,
        revenue: (p.sold || 0) * displayPrice, // Tính doanh thu ước tính
        price: displayPrice,
        stock: currentStock, // Trả về tổng stock thực tế
        image: getProductImage(p),
      };
    });

    // 4. TRẢ VỀ RESPONSE (Giữ nguyên cấu trúc JSON phẳng)
    res.json({
      stats: statsData, // Key này khớp với code cũ
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("Error dashboard summary:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
