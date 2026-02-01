import Order from "../../models/Order.js";
import mongoose from "mongoose";

// Phí sàn cố định 5%
const COMMISSION_RATE = 0.05;

// Tận dụng hàm lấy ngày của bạn
const getStartDate = (range) => {
  const now = new Date();
  if (range === "day") return new Date(now.setHours(0, 0, 0, 0));
  if (range === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (range === "year") return new Date(now.getFullYear(), 0, 1);

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 30);
  return defaultDate;
};

export const getAdminFinancialOverview = async (req, res) => {
  try {
    const { range } = req.query;
    const startDate = getStartDate(range);

    const report = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startDate },
        },
      },
      {
        $facet: {
          // 1. Thống kê tổng quát (Stats)
          summary: [
            {
              $group: {
                _id: null,
                totalGmv: { $sum: "$totalAmount" },
                totalItemsPrice: { $sum: "$itemsPrice" },
                totalOrders: { $sum: 1 },
                // Bảo vệ $reduce bằng $ifNull để tránh lỗi 500 nếu discounts không tồn tại
                totalShopDiscount: {
                  $sum: {
                    $reduce: {
                      input: { $ifNull: ["$discounts", []] },
                      initialValue: 0,
                      in: {
                        $add: [
                          "$$value",
                          {
                            $cond: [
                              { $eq: ["$$this.ownerType", "shop"] },
                              "$$this.amount",
                              0,
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
                totalPlatformDiscount: {
                  $sum: {
                    $reduce: {
                      input: { $ifNull: ["$discounts", []] },
                      initialValue: 0,
                      in: {
                        $add: [
                          "$$value",
                          {
                            $cond: [
                              { $eq: ["$$this.ownerType", "platform"] },
                              "$$this.amount",
                              0,
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
          // 2. Biểu đồ doanh thu theo ngày
          dailyRevenue: [
            {
              $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
            { $project: { date: "$_id", revenue: 1, _id: 0 } },
          ],
          // 3. Phân tích top 5 Shop
          shopAnalysis: [
            {
              $group: {
                _id: "$sellerId",
                revenue: { $sum: "$itemsPrice" },
                shopDiscount: {
                  $sum: {
                    $reduce: {
                      input: { $ifNull: ["$discounts", []] },
                      initialValue: 0,
                      in: {
                        $add: [
                          "$$value",
                          {
                            $cond: [
                              { $eq: ["$$this.ownerType", "shop"] },
                              "$$this.amount",
                              0,
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "info",
              },
            },
            { $unwind: "$info" },
            {
              $project: {
                shopName: "$info.username",
                revenue: 1,
                feeContributed: {
                  $multiply: [
                    { $subtract: ["$revenue", "$shopDiscount"] },
                    COMMISSION_RATE,
                  ],
                },
              },
            },
          ],
        },
      },
    ]);

    const results = report[0];
    const summary = results.summary[0] || {
      totalGmv: 0,
      totalItemsPrice: 0,
      totalOrders: 0,
      totalPlatformDiscount: 0,
      totalShopDiscount: 0,
    };

    // Tính toán lợi nhuận sau khi trừ phí và voucher sàn
    const grossCommission =
      (summary.totalItemsPrice - summary.totalShopDiscount) * COMMISSION_RATE;
    const netPlatformProfit = grossCommission - summary.totalPlatformDiscount;

    // 4. Lịch sử giao dịch gần đây (Populate thông tin liên quan)
    const recentOrders = await Order.find({ status: "delivered" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("sellerId", "username")
      .populate("userId", "username")
      .lean();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalGmv: summary.totalGmv,
          platformProfit: Math.max(0, Math.round(netPlatformProfit)),
          totalOrders: summary.totalOrders,
          totalPlatformVoucherSpent: summary.totalPlatformDiscount,
          commissionRate: COMMISSION_RATE * 100,
        },
        revenueReport: {
          dailyRevenue:
            results.dailyRevenue.length > 0
              ? results.dailyRevenue
              : [{ date: "N/A", revenue: 0 }],
          topShops: results.shopAnalysis,
        },
        payments: recentOrders.map((order) => {
          // Tính toán lại phí cho từng đơn hàng lẻ
          const currentDiscounts = order.discounts || [];
          const shopDisc = currentDiscounts
            .filter((d) => d.ownerType === "shop")
            .reduce((a, b) => a + b.amount, 0);
          const platDisc = currentDiscounts
            .filter((d) => d.ownerType === "platform")
            .reduce((a, b) => a + b.amount, 0);

          const feeFromShop = (order.itemsPrice - shopDisc) * COMMISSION_RATE;

          return {
            id: order.orderCode,
            shop: order.sellerId?.username || "N/A",
            customer: order.userId?.username || "Khách",
            amount: order.totalAmount,
            platformFeeEarned: feeFromShop,
            platformNetEarn: feeFromShop - platDisc,
            date: new Date(order.createdAt).toLocaleString("vi-VN"),
          };
        }),
      },
    });
  } catch (error) {
    console.error("Lỗi Tài chính Admin:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getShopsRevenue = async (req, res) => {
  try {
    const { range } = req.query;
    const startDate = getStartDate(range);

    const shopStats = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$sellerId",
          totalItemsPrice: { $sum: "$itemsPrice" },
          totalOrders: { $sum: 1 },
          totalShopDiscount: {
            $sum: {
              $reduce: {
                input: "$discounts",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $cond: [
                        { $eq: ["$$this.ownerType", "shop"] },
                        "$$this.amount",
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      { $sort: { totalItemsPrice: -1 } },
      {
        $lookup: {
          from: "shops",
          let: { seller_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$owner", "$$seller_id"] } } },
            { $limit: 1 },
          ],
          as: "shopDetail",
        },
      },
      { $unwind: "$shopDetail" },
      {
        $project: {
          _id: 1,
          shopName: "$shopDetail.name",
          shopAvatar: "$shopDetail.logo",
          totalOrders: 1,
          grossRevenue: "$totalItemsPrice",
          shopVoucherSpent: "$totalShopDiscount",
          platformFee: {
            $multiply: [
              { $subtract: ["$totalItemsPrice", "$totalShopDiscount"] },
              COMMISSION_RATE,
            ],
          },
          netPayout: {
            $subtract: [
              { $subtract: ["$totalItemsPrice", "$totalShopDiscount"] },
              {
                $multiply: [
                  { $subtract: ["$totalItemsPrice", "$totalShopDiscount"] },
                  COMMISSION_RATE,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: shopStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
