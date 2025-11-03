import User from "../../models/User.js";
import Address from "../../models/Address.js"; // Tạo model Address mới

// Lấy danh sách địa chỉ của user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Thêm địa chỉ mới
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, fullName, phone, address, isDefault } = req.body;

    // Validate input
    if (!name || !fullName || !phone || !address) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Validate số điện thoại
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
    }

    // Kiểm tra số lượng địa chỉ (tối đa 5)
    const addressCount = await Address.countDocuments({ user: userId });
    if (addressCount >= 5) {
      return res.status(400).json({ message: "Đã đạt tối đa 5 địa chỉ" });
    }

    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (isDefault) {
      await Address.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Tạo địa chỉ mới
    const newAddress = await Address.create({
      name,
      fullName,
      phone,
      address,
      isDefault: isDefault || addressCount === 0, // Nếu là địa chỉ đầu tiên, tự động đặt làm mặc định
      user: userId,
    });

    res.status(201).json({
      message: "Thêm địa chỉ thành công",
      address: newAddress,
    });
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, fullName, phone, address, isDefault } = req.body;

    // Tìm địa chỉ và kiểm tra quyền sở hữu
    const existingAddress = await Address.findOne({ _id: id, user: userId });
    if (!existingAddress) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" });
    }

    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (isDefault) {
      await Address.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        name,
        fullName,
        phone,
        address,
        isDefault,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Cập nhật địa chỉ thành công",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa địa chỉ
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" });
    }

    if (address.isDefault) {
      return res
        .status(400)
        .json({ message: "Không thể xóa địa chỉ mặc định" });
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({ message: "Xóa địa chỉ thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đặt địa chỉ làm mặc định
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra địa chỉ có tồn tại và thuộc về user không
    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" });
    }

    // Bỏ mặc định của tất cả địa chỉ
    await Address.updateMany(
      { user: userId, isDefault: true },
      { isDefault: false }
    );

    // Đặt địa chỉ này làm mặc định
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { isDefault: true },
      { new: true }
    );

    res.status(200).json({
      message: "Đã đặt làm địa chỉ mặc định",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi khi đặt địa chỉ mặc định:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
