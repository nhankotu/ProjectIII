import Order from "../../models/Order.js";

// 1. Hàm phụ trợ: Lấy ngày bắt đầu dựa trên timeRange
const getStartDate = (range) => {
  const now = new Date();
  if (range === "day") return new Date(now.setHours(0, 0, 0, 0)); // Từ 0h sáng nay
  if (range === "week") {
    const day = now.getDay(); // 0 là Chủ nhật
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Tính về thứ 2
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1); // Ngày 1 tháng này
  if (range === "year") return new Date(now.getFullYear(), 0, 1); // Ngày 1/1 năm nay

  // Mặc định trả về 30 ngày trước nếu không khớp
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 30);
  return defaultDate;
};

// 2. Controller chính
export const getFinancialOverview = async (req, res) => {
  try {
    const { range } = req.query; // 'day', 'week', 'month', 'year'

    // Lấy ID người bán từ token (req.user do middleware verifyToken gán vào)
    const sellerId = req.user.id || req.user._id;

    const startDate = getStartDate(range);

    // --- BƯỚC 1: TRUY VẤN DATABASE ---
    // Tìm các đơn hàng của Seller này, trạng thái là "delivered" (đã giao), trong khoảng thời gian
    const orders = await Order.find({
      sellerId: sellerId, // 👉 Khớp với model của bạn
      status: "delivered", // 👉 Chỉ tính đơn đã giao thành công (tiền về túi)
      createdAt: { $gte: startDate },
    })
      .populate("items.product", "category") // Populate để lấy category (nếu model Product có field category)
      .populate("userId", "username name"); // Populate để lấy tên người mua

    // --- BƯỚC 2: TÍNH TOÁN CÁC CON SỐ ---

    // Tổng doanh thu (Cộng dồn totalAmount)
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Tổng số đơn
    const totalOrders = orders.length;

    // --- BƯỚC 3: ƯỚC TÍNH CHI PHÍ (VÌ DB CHƯA CÓ GIÁ VỐN) ---
    // Giả sử lợi nhuận ròng là 35% trên tổng doanh thu
    const profitRate = 0.35;
    const netProfit = totalRevenue * profitRate;

    // Giả sử giá vốn (COGS) là 50%
    const cogs = totalRevenue * 0.5;

    // Giả sử chi phí vận hành/marketing là 15%
    const operatingCosts = totalRevenue * 0.15;

    // --- BƯỚC 4: XỬ LÝ BIỂU ĐỒ (DOANH THU THEO NGÀY) ---
    const dailyMap = {};
    orders.forEach((order) => {
      // Format ngày: DD/MM (Ví dụ: 05/10)
      const dateObj = new Date(order.createdAt);
      const dateStr = `${dateObj.getDate().toString().padStart(2, "0")}/${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + order.totalAmount;
    });

    // Chuyển object thành array cho biểu đồ
    const dailyRevenueChart = Object.keys(dailyMap).map((date) => ({
      date,
      revenue: dailyMap[date],
    }));

    // Sắp xếp ngày tăng dần (để biểu đồ không bị lộn xộn)
    dailyRevenueChart.sort((a, b) => {
      const [d1, m1] = a.date.split("/");
      const [d2, m2] = b.date.split("/");
      return m1 - m2 || d1 - d2;
    });

    // --- BƯỚC 5: TÍNH DOANH THU THEO DANH MỤC ---
    const categoryMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Lấy tên category từ product đã populate. Nếu lỗi hoặc không có thì để "Khác"
        const catName = item.product?.category || "Khác";
        // Tính doanh thu item: giá * số lượng
        const itemRevenue = item.price * item.quantity;

        categoryMap[catName] = (categoryMap[catName] || 0) + itemRevenue;
      });
    });

    const categoryChart = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      revenue: categoryMap[cat],
      percentage:
        totalRevenue > 0
          ? Math.round((categoryMap[cat] / totalRevenue) * 100)
          : 0,
    }));

    // --- BƯỚC 6: TRẢ VỀ DỮ LIỆU JSON ĐÚNG CẤU TRÚC FRONTEND ---
    const responseData = {
      // 1. Dashboard Stats
      stats: {
        revenue: totalRevenue,
        profit: netProfit,
        orders: totalOrders,
        profitMargin: 35, // % giả định
        conversionRate: 0, // Cần hệ thống tracking view mới tính được
        operatingCosts: operatingCosts,
        averageOrderValue:
          totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        refundRate: 0,
      },

      // 2. Revenue Report (Biểu đồ chính)
      revenueReport: {
        current: totalRevenue,
        previous: 0, // Cần query thêm tháng trước nếu muốn tính growth thật
        growth: 100, // Tạm để 100%
        dailyRevenue:
          dailyRevenueChart.length > 0
            ? dailyRevenueChart
            : [{ date: "Hôm nay", revenue: 0 }],
        byCategory: categoryChart,
      },

      // 3. Expenses (Ước tính để vẽ biểu đồ tròn)
      expenses: {
        total: totalRevenue - netProfit,
        breakdown: [
          { category: "Giá vốn (COGS)", amount: cogs, percentage: 50 },
          {
            category: "Vận hành & MKT",
            amount: operatingCosts,
            percentage: 15,
          },
        ],
      },

      // 4. Payment History (Lấy 5 đơn mới nhất)
      payments: orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Mới nhất lên đầu
        .slice(0, 5)
        .map((order) => ({
          id: `PMT-${order._id.toString().slice(-6).toUpperCase()}`,
          orderId:
            order.orderCode ||
            `ORD-${order._id.toString().slice(-6).toUpperCase()}`, // Ưu tiên orderCode nếu có
          customer: order.shippingAddress?.fullName || "Khách vãng lai",
          amount: order.totalAmount,
          method: order.paymentMethod, // COD, MOMO...
          status: "completed",
          date: new Date(order.createdAt).toLocaleString("vi-VN"), // Format ngày giờ VN
        })),

      // 5. Profit Analysis
      profitAnalysis: {
        grossProfit: totalRevenue - cogs,
        netProfit: netProfit,
        marginByCategory: [],
        monthlyTrend: [],
      },
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Financial Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tính toán tài chính: " + error.message,
    });
  }
};
