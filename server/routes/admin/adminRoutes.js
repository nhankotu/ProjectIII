import express from "express";
import multer from "multer";

// Controllers
import { createAdmin } from "../../controllers/admin/adminController.js";
import { requireAuth, requireAdmin } from "../../middleware/authMiddleware.js";
import { uploadForCloudinary } from "../../middleware/uploadMiddleware.js";
import {
  createFlashSaleSession,
  getAllSessions,
  getPendingFlashSales,
  approveFlashSaleItem,
  rejectFlashSaleItem,
} from "../../controllers/admin/flashSaleController.js";
import {
  createCategory,
  deleteCategory,
  getAdminCategoryTree,
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
// 🔥 Import các hàm doanh thu
import {
  getAdminFinancialOverview,
  getShopsRevenue, // Đảm bảo bạn đã export hàm này trong controller
} from "../../controllers/admin/revenueController.js";

const router = express.Router();

// Cấu hình multer
const upload = multer({ storage: multer.memoryStorage() });

// --- MIDDLEWARE BẢO VỆ (Tất cả route admin đều đi qua đây) ---
router.use(requireAuth);
router.use(requireAdmin);

// ============================
// 1. QUẢN LÝ TÀI KHOẢN ADMIN
// ============================
router.post("/create", createAdmin);

// ============================
// 2. QUẢN LÝ NGƯỜI DÙNG & SELLER
// ============================
router.get("/users", getAllUsers);
router.put("/users/:id/approve", approveSeller);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);

// ============================
// 3. QUẢN LÝ DOANH THU (REVENUE)
// ============================
// Khớp với trang: /admin/revenue/platform
router.get("/revenue/platform", getAdminFinancialOverview);

// Khớp với trang: /admin/revenue/shops
router.get("/revenue/shops", getShopsRevenue);

// ============================
// 4. QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ============================
router.get("/products/stats", getProductStats); // Phải đặt trước :id
router.get("/products", getAllProducts);
router.get("/products/:id", getProductDetail);
router.put("/products/:id/status", updateProductStatus);
router.delete("/products/:id", deleteProduct);

// ============================
// 5. QUẢN LÝ DANH MỤC (CATEGORIES)
// ============================
router.post("/categories", uploadForCloudinary, createCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/categories/tree", getAdminCategoryTree);
// ============================
// 6. QUẢN LÝ FLASH SALES
// ============================
router.post(
  "/flash-sales/sessions",
  uploadForCloudinary,
  createFlashSaleSession,
);
router.get("/flash-sales/sessions", getAllSessions);
router.get("/flash-sales/pending", getPendingFlashSales);
router.post("/flash-sales/approve", approveFlashSaleItem);
router.post("/flash-sales/reject", rejectFlashSaleItem);

export default router;
