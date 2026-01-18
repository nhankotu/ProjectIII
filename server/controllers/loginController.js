import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Thêm dòng này
export const loginUser = async (req, res) => {
  try {
    // 1. Nhận input (Lưu ý: biến username ở đây có thể là email do người dùng nhập)
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tài khoản và mật khẩu." });
    }

    // 2. Tìm User bằng Username HOẶC Email (Logic chuẩn UX)
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });

    // 3. Check Pass (Plain text mode)
    if (!user) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác." });
    }

    // bcrypt.compare(mật khẩu chưa mã hóa, mật khẩu đã mã hóa trong DB)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác." });
    }

    // 4. Check isActive
    if (user.isActive === false) {
      if (user.role === "seller") {
        return res.status(403).json({
          message: "Tài khoản Seller đang chờ duyệt hoặc đã bị khóa.",
        });
      }
      return res.status(403).json({
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ Admin.",
      });
    }

    // 5. Tạo Token (QUAN TRỌNG: Phải có ROLE)
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role, // <--- Đã thêm role
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 6. Xử lý dữ liệu trả về (Loại bỏ password an toàn)
    const userResponse = { ...user._doc }; // Copy dữ liệu user
    delete userResponse.password; // Xóa password khỏi object trả về

    // Logic redirect (Frontend nên xử lý cái này, nhưng backend gợi ý cũng ok)
    let redirectTo = "/";
    if (user.role === "admin") redirectTo = "/admin";
    else if (user.role === "seller") redirectTo = "/seller";

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: userResponse, // Trả về object đã xóa password
      redirectTo,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
