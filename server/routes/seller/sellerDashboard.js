import express from "express";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getDashboardSummary, // Thêm function mới
} from "../../controllers/seller/dashboardController.js";
import { requireAuth, requireSeller } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Tất cả routes đều cần auth và seller role
router.use(requireAuth, requireSeller);

// GET /api/seller/dashboard/stats - Lấy thống kê tổng quan
router.get("/stats", getDashboardStats);

// GET /api/seller/dashboard/recent-orders - Lấy đơn hàng gần đây
router.get("/recent-orders", getRecentOrders);

// GET /api/seller/dashboard/top-products - Lấy sản phẩm bán chạy
router.get("/top-products", getTopProducts);

// GET /api/seller/dashboard/summary - Lấy tất cả dashboard data (tối ưu)
router.get("/summary", getDashboardSummary);

export default router;
