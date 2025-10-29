import User from "../models/User.js";
import OTP from "../models/otp.js";
// Đăng ký
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(req.body);
    // Kiểm tra dữ liệu
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra trùng dữ liệu
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
    }

    //otp
    // Nếu chưa có otp gửi về trước đó => thông báo gửi OTP
    if (!otp) {
      return res
        .status(200)
        .json({ message: "Vui lòng xác nhận OTP trước khi đăng ký" });
    }
    // Kiểm tra OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Xóa OTP sau khi xác thực
    await OTP.deleteOne({ email, otp });

    // Tạo người dùng mới
    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công!", user });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// Đăng nhập
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res
        .status(400)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu." });
    }

    res.status(200).json({
      message: "Đăng nhập thành công!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },

      redirectTo:
        user.role === "admin"
          ? "/admin"
          : user.role === "seller"
          ? "/seller"
          : "/",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
