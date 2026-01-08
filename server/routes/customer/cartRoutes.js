import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart, // ✅ Bỏ comment dòng này
  updateCartItem, // ✅ Bỏ comment dòng này
} from "../../controllers/customer/cartController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Tất cả thao tác giỏ hàng đều yêu cầu đăng nhập
router.use(requireAuth);

// GET /api/cart - Xem giỏ hàng
router.get("/", getCart);

// POST /api/cart/add - Thêm sản phẩm vào giỏ
router.post("/add", addToCart);

// ✅ MỞ KHÓA 2 ROUTE NÀY:
// PUT /api/cart/update - Cập nhật số lượng (+/-)
router.put("/update", updateCartItem);

// DELETE /api/cart/remove/:itemId - Xóa 1 món khỏi giỏ
// :itemId là ID của cái item trong giỏ (không phải productId)
router.delete("/remove/:itemId", removeFromCart);

export default router;
