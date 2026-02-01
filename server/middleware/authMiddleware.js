import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= 1. REQUIRE AUTH =================
export const requireAuth = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Truy cập bị từ chối. Vui lòng đăng nhập.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Tìm User trong DB (Bỏ qua password)
    const user = await User.findById(decoded.id).select("-password");

    // 4. Các trường hợp User không hợp lệ
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại.",
      });
    }

    // 🔥 QUAN TRỌNG: Check xem user có bị khóa không?
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.",
      });
    }

    // 5. Gán user vào request để dùng ở controller tiếp theo
    req.user = user;

    // Log email cho chắc chắn vì username có thể null
    // console.log("✅ Auth Success:", user.email);

    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);

    // Xử lý riêng lỗi hết hạn
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        code: "TOKEN_EXPIRED", // Frontend dựa vào code này để auto logout
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    res.status(500).json({ success: false, message: "Lỗi xác thực hệ thống." });
  }
};

// ================= 2. REQUIRE SELLER =================
export const requireSeller = async (req, res, next) => {
  try {
    // Middleware này chạy SAU requireAuth nên chắc chắn đã có req.user
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Admin luôn có quyền của Seller
    const allowedRoles = ["seller", "admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Chức năng chỉ dành cho Người bán (Seller).",
      });
    }

    next();
  } catch (error) {
    console.error("Seller Auth Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

// ================= 3. REQUIRE ADMIN =================
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Truy cập bị từ chối. Chỉ dành cho Admin.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
