import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
//import { authCheck } from "../controllers/authController.js"; // Thêm import này
//import { requireAuth } from "../middleware/authMiddleware.js"; // Thêm middleware
const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);
router.post("/login", loginUser);
//router.get("/check", requireAuth, authCheck); // Thêm route mới

export default router;
