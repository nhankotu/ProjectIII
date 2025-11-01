import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Login endpoint thật
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("📨 Login attempt for:", username);

    // Tìm user thật từ database
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Kiểm tra password thật
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Tạo token thật
    const token = generateToken(user._id);

    // Trả về user thật (không có password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        // Thêm các field khác nếu cần
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Auth check endpoint - trả về user thật
export const authCheck = async (req, res) => {
  try {
    // User thật đã được set bởi middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        // Thêm các field khác từ user thật
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication check",
    });
  }
};
