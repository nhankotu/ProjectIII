import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import cloudinary from "../../config/cloudinary.js";
import { sendOTPService, verifyOTPService } from "../../services/otpService.js";
import fs from "fs";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// ================= AUTH CHECK =================
export const authCheck = async (req, res) => {
  try {
    const user = req.user; // User này đã được middleware giải mã và lấy từ DB

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        _id: user._id,
        name: user.name, // ✅ Đã có
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        wallet: user.wallet, // Thêm ví để FE hiển thị
        points: user.points, // Thêm điểm
        // ❌ Đã xóa addresses vì bảng User không còn lưu trực tiếp
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= UPLOAD AVATAR =================
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Không có file được tải lên.",
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser)
      return res.status(404).json({ message: "User không tồn tại" });

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
    });

    // Xóa file tạm
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    // Xóa ảnh cũ trên Cloudinary (trừ ảnh mặc định)
    const oldAvatarUrl = currentUser.avatar;
    if (
      oldAvatarUrl &&
      oldAvatarUrl.includes("cloudinary") &&
      !oldAvatarUrl.includes("default-avatar")
    ) {
      try {
        const publicId = `avatars/${
          oldAvatarUrl.split("/").pop().split(".")[0]
        }`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Lỗi xóa ảnh cũ:", err.message);
      }
    }

    // Cập nhật DB
    currentUser.avatar = result.secure_url;
    await currentUser.save();

    res.json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công!",
      avatar: currentUser.avatar, // Chỉ cần trả về link mới
    });
  } catch (error) {
    console.error("Lỗi upload avatar:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN (Username HOẶC Email) =================
export const loginUser = async (req, res) => {
  try {
    // Frontend gửi field là 'username' nhưng người dùng có thể nhập email vào đó
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tài khoản và mật khẩu.",
      });
    }

    // 🔥 LOGIC TÌM KIẾM ĐA NĂNG (LOGIN BẰNG EMAIL HOẶC USERNAME)
    const user = await User.findOne({
      $or: [
        { email: username.toLowerCase() }, // Tìm theo Email
        { username: username.toLowerCase() }, // Tìm theo Username
      ],
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác.",
      });
    }

    // Check pass
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác.",
      });
    }

    // Check Active
    if (user.isActive === false) {
      const msg =
        user.role === "seller"
          ? "Tài khoản Shop đang chờ duyệt."
          : "Tài khoản đã bị khóa.";
      return res.status(403).json({ success: false, message: msg });
    }

    // Tạo Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name, // Lấy name thay vì username (vì username có thể null)
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    let redirectTo = "/";
    if (user.role === "admin") redirectTo = "/admin/dashboard";
    else if (user.role === "seller") redirectTo = "/seller/dashboard";

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: userResponse,
      redirectTo,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    // ⚠️ ĐÃ SỬA: Thêm 'name' vào input
    const { name, username, email, password, role, otp } = req.body;

    // Validate
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập họ tên, tên đăng nhập, email và mật khẩu.",
      });
    }

    // Gửi OTP (Nếu chưa có)
    if (!otp) {
      const userExists = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message:
            userExists.email === email
              ? "Email đã được sử dụng!"
              : "Tên đăng nhập đã tồn tại!",
        });
      }

      const result = await sendOTPService(email);
      if (!result.success) {
        return res
          .status(500)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({
        success: true,
        message: "OTP đã được gửi đến email của bạn.",
      });
    }

    // Xác thực OTP & Đăng ký
    const otpCheck = await verifyOTPService(email, otp);
    if (!otpCheck.success) {
      return res
        .status(400)
        .json({ success: false, message: otpCheck.message });
    }

    // Check trùng lần cuối
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã tồn tại!" });

    // 🔥 ĐÃ SỬA: Tạo User có 'name'
    const isActiveStatus = role === "seller" ? false : true;

    const user = new User({
      name, // ✅ Bắt buộc
      username, // ✅ Bắt buộc (theo validate ở trên)
      email,
      password,
      role: role || "customer",
      isActive: isActiveStatus,
      isEmailVerified: true, // Vì đã check OTP nên set luôn là true
    });

    await user.save();

    if (role === "seller") {
      try {
        const defaultShopName = `Shop của ${name}`;

        await Shop.create({
          owner: user._id, // Liên kết với User vừa tạo
          name: defaultShopName,
          // Slug sẽ tự tạo nhờ middleware pre-save trong Model Shop (nếu bạn đã cài)
          // Hoặc bạn có thể tự gen slug ở đây nếu muốn:
          // slug: `shop-${user._id}`,

          status: "pending", // ⚠️ QUAN TRỌNG: Trạng thái chờ Admin duyệt cùng User

          // Điền dữ liệu giả để qua được Validate (vì User chưa setup shop)
          contact: {
            phone: "",
            address: "Chưa cập nhật",
            email: email,
          },
          shippingConfig: {
            partners: [], // Chưa chọn đơn vị vận chuyển
            freeShipThreshold: 0,
          },
        });

        console.log(`✅ Đã tạo Shop Pending cho User: ${user.username}`);
      } catch (shopError) {
        console.error("❌ Lỗi tạo Shop tự động:", shopError);
      }

      return res.status(201).json({
        success: true,
        message:
          "Đăng ký Seller thành công! Vui lòng chờ Admin phê duyệt tài khoản và cửa hàng.",
        requiresApproval: true,
      });
    }

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      requiresApproval: false,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server, vui lòng thử lại sau." });
  }
};
