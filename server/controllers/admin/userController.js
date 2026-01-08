import User from "../../models/User.js";
import Shop from "../../models/Shop.js"; // Import model Shop để đồng bộ trạng thái

// ✅ 1. Duyệt Seller (Mở khóa tài khoản & Kích hoạt Shop)
export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params;

    // Bước 1: Active tài khoản User
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy User" });
    }

    // Bước 2: Nếu user là Seller, phải Active luôn cái Shop của họ
    if (user.role === "seller") {
      const shop = await Shop.findOneAndUpdate(
        { owner: user._id },
        { status: "active" }, // Chuyển trạng thái Shop sang hoạt động
        { new: true }
      );

      // (Optional) Gửi email thông báo: "Shop của bạn đã được duyệt!"
    }

    res.status(200).json({
      success: true,
      message: "Đã duyệt Seller và kích hoạt Shop thành công!",
      user: {
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ⛔ 2. Khóa tài khoản (Ban User/Seller)
export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Lý do khóa (nếu cần lưu log)

    // Bước 1: Deactive tài khoản User (Không cho đăng nhập)
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy User" });
    }

    // Bước 2: Nếu là Seller, phải khóa luôn Shop (để ẩn sản phẩm)
    if (user.role === "seller") {
      await Shop.findOneAndUpdate({ owner: user._id }, { status: "banned" });
    }

    res.status(200).json({
      success: true,
      message: `Đã khóa tài khoản ${user.username}`,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 3. Lấy danh sách User (Để Admin chọn người mà khóa/duyệt)
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (role) filter.role = role; // Lọc theo seller hoặc customer

    const users = await User.find(filter)
      .select("-password") // Không lấy mật khẩu
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4. Mở khóa tài khoản (Unban User/Seller)
export const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Bước 1: Kích hoạt lại tài khoản User
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Bước 2: Nếu là Seller, mở lại Shop (Chuyển từ 'banned' về 'active')
    if (user.role === "seller") {
      await Shop.findOneAndUpdate(
        { owner: user._id },
        { status: "active" } // Hoặc 'pending' tùy quy trình của bạn
      );
    }

    res.status(200).json({
      success: true,
      message: `Đã mở khóa tài khoản ${user.username}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
