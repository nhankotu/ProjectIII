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
