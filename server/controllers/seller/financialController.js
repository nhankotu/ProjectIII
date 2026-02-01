import Order from "../../models/Order.js";

const COMMISSION_RATE = 0.05; // 5%

// Helper: Lấy ngày bắt đầu
const getStartDate = (range) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (range === "day") return now;
  if (range === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  }
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (range === "year") return new Date(now.getFullYear(), 0, 1);
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 30);
  return defaultDate;
};

export const getFinancialOverview = async (req, res) => {
  try {
    const { range } = req.query;
    const sellerId = req.user.id || req.user._id;
    const startDate = getStartDate(range);

    const orders = await Order.find({
      sellerId,
      status: { $in: ["delivered", "completed", "shipped", "confirmed"] },
      createdAt: { $gte: startDate },
    })
      .populate({
        path: "items.product",
        select: "category price name",
        populate: { path: "category", select: "name" },
      })
      .populate("userId", "name username");

    // --- TÍNH TOÁN  LOGIC TÀI CHÍNH ---

    let totalRevenue = 0;
    let totalItemsPrice = 0;
    let totalPlatformFee = 0;
    let totalCOGS = 0;
    let totalShipping = 0;

    orders.forEach((order) => {
      totalRevenue += Number(order.totalAmount) || 0;

      const shopDiscount = (order.discounts || [])
        .filter((d) => d.ownerType === "shop")
        .reduce((sum, d) => sum + d.amount, 0);

      const itemsPrice = Number(order.itemsPrice) || 0;
      const feeBase = Math.max(0, itemsPrice - shopDiscount);
      const orderFee = feeBase * COMMISSION_RATE;

      totalPlatformFee += orderFee;
      totalItemsPrice += itemsPrice;

      // 4. Các chỉ số phụ
      totalCOGS += Number(order.totalAmount) * 0.5;

      totalShipping += Number(order.shippingPrice) || 0;
    });

    const totalOrders = orders.length;

    // --- ƯỚC TÍNH CHI PHÍ ---
    const cogs = totalRevenue * 0.5;
    const marketing = totalRevenue * 0.1;
    const shipping = totalRevenue * 0.05;

    const totalExpenses = cogs + marketing + shipping + totalPlatformFee;
    const netProfit = totalRevenue - totalExpenses;

    // --- BIỂU ĐỒ NGÀY ---
    const dailyMap = {};
    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      dailyMap[key] = (dailyMap[key] || 0) + (Number(order.totalAmount) || 0);
    });

    const dailyRevenueChart = Object.keys(dailyMap)
      .map((date) => ({ date, total: dailyMap[date] }))
      .sort((a, b) => {
        const [d1, m1] = a.date.split("/");
        const [d2, m2] = b.date.split("/");
        return m1 - m2 || d1 - d2;
      });

    // --- DANH MỤC ---
    const categoryMap = {};
    orders.forEach((order) => {
      if (order.items?.length) {
        order.items.forEach((item) => {
          const catName = item.product?.category?.name || "Khác";
          const revenue =
            (Number(item.price) || 0) * (Number(item.quantity) || 1);
          categoryMap[catName] = (categoryMap[catName] || 0) + revenue;
        });
      }
    });
    const categoryChart = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      total: categoryMap[cat],
      percentage:
        totalRevenue > 0
          ? Math.round((categoryMap[cat] / totalRevenue) * 100)
          : 0,
    }));

    // --- RESPONSE ---
    const responseData = {
      stats: {
        revenue: totalRevenue,
        profit: netProfit,
        orders: totalOrders,
        profitMargin:
          totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0,
        conversionRate: 0,
        operatingCosts: marketing + shipping + totalPlatformFee,
        averageOrderValue:
          totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        refundRate: 0,
      },
      revenueReport: {
        current: totalRevenue,
        growth: 100,
        dailyRevenue:
          dailyRevenueChart.length > 0
            ? dailyRevenueChart
            : [{ date: "Hôm nay", total: 0 }],
        byCategory: categoryChart,
      },
      expenses: {
        total: totalExpenses,
        cogs,
        marketing,
        shipping,
        platformFees: totalPlatformFee,
        breakdown: [
          {
            category: "Giá vốn (COGS)",
            amount: cogs,
            percentage: 50,
            key: "cogs",
          },
          {
            category: "Marketing",
            amount: marketing,
            percentage: 10,
            key: "marketing",
          },
          {
            category: "Vận chuyển",
            amount: shipping,
            percentage: 5,
            key: "shipping",
          },
          {
            category: "Phí sàn",
            amount: totalPlatformFee,
            percentage: 5,
            key: "platformFees",
          },
        ],
      },
      payments: orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((order) => ({
          id: `PMT-${order._id.toString().slice(-6).toUpperCase()}`,
          orderId: order.orderCode || "ORD-N/A",
          customer:
            order.shippingAddress?.fullName ||
            order.userId?.name ||
            "Khách hàng",
          amount: order.totalAmount,
          method: order.paymentMethod,
          status: "completed",
          date: new Date(order.createdAt).toLocaleString("vi-VN"),
        })),
      profitAnalysis: {
        grossProfit: totalRevenue - cogs,
        netProfit,
        marginByCategory: [],
        monthlyTrend: [],
      },
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Financial Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
