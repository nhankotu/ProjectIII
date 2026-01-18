import User from "../../models/User.js";

// Cập nhật thông tin user
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // 🔥 SỬA TẠI ĐÂY: Thử lấy _id trước, nếu không có mới lấy id
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Không tìm thấy ID người dùng trong yêu cầu" });
    }

    // Kiểm tra xem email có bị trùng với người khác không (nếu có update email)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email này đã được sử dụng bởi người khác" });
      }
    }

    // Tìm và cập nhật user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name?.trim(),
          phone: phone?.trim(),
          email: email?.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại trong hệ thống" });
    }

    // Trả về cấu trúc giống hệt lúc Login để Frontend dễ xử lý
    res.status(200).json({
      success: true, // Thêm success để đồng bộ với interceptor frontend
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);

    // Trả về lỗi chi tiết từ Mongoose (ví dụ lỗi Validation số điện thoại)
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.message || "Lỗi server khi cập nhật",
      error: error.message,
    });
  }
};

// Lấy thông tin user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy profile:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
