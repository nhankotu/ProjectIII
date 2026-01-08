import express from "express";
import { createAdmin } from "../../controllers/admin/adminController.js";
import { requireAuth, requireAdmin } from "../../middleware/authMiddleware.js";
import {
  getPendingFlashSales,
  approveFlashSale,
  rejectFlashSale,
} from "../../controllers/admin/flashSaleController.js";
import {
  createCategory,
  deleteCategory,
} from "../../controllers/admin/categoryController.js";
import {
  getAllProducts,
  getProductDetail,
  updateProductStatus,
  deleteProduct,
  getProductStats,
} from "../../controllers/admin/productController.js";

import {
  approveSeller,
  banUser,
  getAllUsers,
  unbanUser,
} from "../../controllers/admin/userController.js";
const router = express.Router();

// --- MIDDLEWARE ---
router.use(requireAuth);
router.use(requireAdmin);

// ============================
// 1. QUẢN LÝ ADMIN ACCOUNT
// ============================
router.post("/create", createAdmin);

// ============================
// 2. QUẢN LÝ FLASH SALES
// ============================
router.get("/flash-sales/pending", getPendingFlashSales);
router.put("/flash-sales/approve/:id", approveFlashSale);
router.put("/flash-sales/reject/:id", rejectFlashSale);

// ============================
// 3. QUẢN LÝ CATEGORY (Thêm prefix /categories)
// ============================
// POST /api/admin/categories
router.post("/categories", createCategory);

// DELETE /api/admin/categories/:id
router.delete("/categories/:id", deleteCategory);

// ============================
// 4. QUẢN LÝ PRODUCT (Thêm prefix /products)
// ============================
// GET /api/admin/products/stats
// ⚠️ QUAN TRỌNG: Route cụ thể (stats) phải đặt TRƯỚC route có tham số (:id)
router.get("/products/stats", getProductStats);

// GET /api/admin/products
router.get("/products", getAllProducts);

// GET /api/admin/products/:id
router.get("/products/:id", getProductDetail);

// PUT /api/admin/products/:id/status
router.put("/products/:id/status", updateProductStatus);

// DELETE /api/admin/products/:id
router.delete("/products/:id", deleteProduct);

router.get("/users", getAllUsers); // Xem danh sách user
router.put("/users/:id/approve", approveSeller); // Duyệt
router.put("/users/:id/ban", banUser); // Khóa
router.put("/users/:id/unban", unbanUser); // mở
export default router;
