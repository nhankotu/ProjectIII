import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    console.log("🔐 Auth middleware called");

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
      });
    }

    // 🔥 Dùng CÙNG secret với login
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log("🔑 Verifying with hardcoded secret");

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    req.user = user;
    console.log("✅ User authenticated:", user.username);

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token: " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error in authentication.",
    });
  }
};

export const requireSeller = async (req, res, next) => {
  try {
    console.log("👨‍💼 Seller middleware called");

    // Đảm bảo requireAuth đã chạy trước
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập trước",
      });
    }

    // Kiểm tra role - điều chỉnh logic theo model User của bạn
    const allowedRoles = ["seller", "admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Truy cập bị từ chối. Yêu cầu quyền seller.",
        userRole: req.user.role,
      });
    }

    console.log("✅ Seller authorized:", req.user.username);
    next();
  } catch (error) {
    console.error("❌ Seller middleware error:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực quyền seller.",
    });
  }
};
export const requireAdmin = async (req, res, next) => {
  try {
    console.log("👮 Admin middleware called");

    // 1. Đảm bảo requireAuth đã chạy và user đã đăng nhập
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập trước khi thực hiện thao tác này.",
      });
    }

    // 2. Kiểm tra quyền Admin
    // Lưu ý: So sánh chính xác chuỗi "admin"
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Truy cập bị từ chối. Chỉ Admin mới có quyền này.",
        userRole: req.user.role, // Trả về role hiện tại để debug dễ hơn
      });
    }

    console.log("✅ Admin authorized:", req.user.username);
    next();
  } catch (error) {
    console.error("❌ Admin middleware error:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực quyền Admin.",
    });
  }
};
