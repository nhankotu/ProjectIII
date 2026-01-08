import express from "express";
import {
  createOrder,
  getUserOrders, // 👈 Import hàm vừa thêm
} from "../../controllers/customer/orderController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Yêu cầu đăng nhập
router.use(requireAuth);

// POST /api/orders - Tạo đơn hàng (Checkout)
router.post("/", createOrder);

// GET /api/orders - Xem lịch sử mua hàng
router.get("/", getUserOrders);

// GET /api/orders/:id - Xem chi tiết 1 đơn hàng (Bạn tự làm thêm nếu cần)
// router.get("/:id", getOrderById);

export default router;
