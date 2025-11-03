import User from "../../models/User.js";

// Cập nhật thông tin user
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const userId = req.user.id; // Lấy từ middleware auth

    // Tìm và cập nhật user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        email,
      },
      {
        new: true, // Trả về document đã update
        runValidators: true, // Chạy validator
      }
    ).select("-password"); // Không trả về password

    if (!updatedUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy thông tin user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

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
