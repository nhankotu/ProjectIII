import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { authCheck, uploadAvatar } from "../controllers/user/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  updateProfile,
  getProfile,
} from "../controllers/user/userController.js";
import { uploadAvatar as uploadMiddleware } from "../middleware/uploadMiddleware.js"; // 👈 IMPORT TỪ MIDDLEWARE
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/user/addressController.js";
const router = express.Router();

// Routes - Clean và gọn gàng
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check", requireAuth, authCheck);
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.post("/avatar", requireAuth, uploadMiddleware, uploadAvatar); // 👈 DÙNG MIDDLEWARE

// Address routes - THÊM requireAuth
router.get("/address", requireAuth, getAddresses);
router.post("/address", requireAuth, addAddress);
router.put("/address/:id", requireAuth, updateAddress);
router.delete("/address/:id", requireAuth, deleteAddress);
router.put("/address/:id/default", requireAuth, setDefaultAddress);

export default router;
