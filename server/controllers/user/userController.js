import User from "../../models/User.js";
import Address from "../../models/Address.js";
// ================= CẬP NHẬT PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    // 1. Nhận thêm gender và dateOfBirth từ Frontend
    const { name, phone, gender, dateOfBirth } = req.body;

    // Lưu ý: Thường Email và Username không cho đổi tùy tiện ở trang profile
    // (cần quy trình riêng verify email mới). Nên mình tạm bỏ email ra khỏi list update này.

    const userId = req.user._id || req.user.id;

    // 2. Kiểm tra trùng số điện thoại (NẾU CÓ THAY ĐỔI)
    // Logic: Nếu có gửi phone lên VÀ phone đó khác phone hiện tại -> Check trùng
    if (phone) {
      // Tìm xem có ai KHÁC đang dùng sđt này không
      const existingPhone = await User.findOne({
        phone: phone,
        _id: { $ne: userId }, // Trừ bản thân mình ra
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại này đã được liên kết với tài khoản khác.",
        });
      }
    }

    // 3. Chuẩn bị dữ liệu update
    const updateData = {
      name: name?.trim(),
      phone: phone?.trim(),
      gender: gender, // 'male', 'female', 'other'
      dateOfBirth: dateOfBirth, // Frontend gửi dạng 'YYYY-MM-DD'
    };

    // Loại bỏ các trường null/undefined (để tránh ghi đè dữ liệu cũ bằng null)
    Object.keys(updateData).forEach(
      (key) =>
        (updateData[key] === undefined || updateData[key] === null) &&
        delete updateData[key]
    );

    // 4. Thực hiện Update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true, // Trả về data mới sau khi update
        runValidators: true, // Chạy validate của Model (check enum gender...)
      }
    ).select("-password"); // Không trả về password

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại." });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    // Xử lý lỗi Validate của Mongoose (VD: Sai định dạng enum gender)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật hồ sơ.",
      error: error.message,
    });
  }
};

// ================= LẤY THÔNG TIN PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });
    }

    // Đồng bộ cấu trúc trả về với updateProfile
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// ================= LẤY DANH SÁCH ĐỊA CHỈ =================
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ Middleware auth

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1, // Mặc định lên đầu
      createdAt: -1, // Mới nhất lên tiếp theo
    });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Lỗi lấy địa chỉ:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ================= THÊM ĐỊA CHỈ MỚI =================
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Nhận đúng các trường từ Model Address
    const {
      fullName,
      phone,
      province,
      provinceCode,
      district,
      districtCode,
      ward,
      wardCode,
      detailAddress,
      label,
      isDefault,
    } = req.body;

    // 2. Validate input cơ bản (Model đã validate kỹ, controller check sơ bộ)
    if (
      !fullName ||
      !phone ||
      !province ||
      !district ||
      !ward ||
      !detailAddress
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng điền đầy đủ thông tin địa chỉ (Tỉnh, Huyện, Xã, Chi tiết).",
      });
    }

    // 3. Giới hạn số lượng địa chỉ (Ví dụ tối đa 10)
    const count = await Address.countDocuments({ user: userId });
    if (count >= 10) {
      return res.status(400).json({
        success: false,
        message: "Bạn chỉ được lưu tối đa 10 địa chỉ.",
      });
    }

    // 4. Xử lý Logic Mặc định
    // Nếu đây là địa chỉ đầu tiên -> Tự động là mặc định
    // Nếu user chọn isDefault = true -> Bỏ mặc định các cái cũ
    let shouldBeDefault = isDefault;
    if (count === 0) shouldBeDefault = true;

    if (shouldBeDefault) {
      await Address.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );
    }

    // 5. Tạo địa chỉ
    const newAddress = await Address.create({
      user: userId,
      fullName,
      phone,
      province,
      provinceCode,
      district,
      districtCode,
      ward,
      wardCode,
      detailAddress,
      label: label || "Nhà riêng", // Default nếu không gửi
      isDefault: shouldBeDefault,
    });

    res.status(201).json({
      success: true,
      message: "Thêm địa chỉ thành công",
      data: newAddress,
    });
  } catch (error) {
    console.error("Lỗi thêm địa chỉ:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CẬP NHẬT ĐỊA CHỈ =================
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Nhận data giống hàm Add
    const {
      fullName,
      phone,
      province,
      provinceCode,
      district,
      districtCode,
      ward,
      wardCode,
      detailAddress,
      label,
      isDefault,
    } = req.body;

    // 1. Kiểm tra tồn tại và quyền sở hữu
    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Địa chỉ không tồn tại" });
    }

    // 2. Xử lý Logic Mặc định khi Update
    if (isDefault) {
      await Address.updateMany(
        { user: userId, _id: { $ne: id } }, // Trừ cái đang sửa ra
        { isDefault: false }
      );
    }

    // 3. Thực hiện Update
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        fullName,
        phone,
        province,
        provinceCode,
        district,
        districtCode,
        ward,
        wardCode,
        detailAddress,
        label,
        isDefault: isDefault || address.isDefault, // Nếu không gửi isDefault thì giữ nguyên
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật địa chỉ thành công",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi cập nhật địa chỉ:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= XÓA ĐỊA CHỈ =================
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Địa chỉ không tồn tại" });
    }

    // Không cho xóa địa chỉ mặc định (tránh lỗi đơn hàng không có địa chỉ)
    if (address.isDefault) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa địa chỉ mặc định. Hãy đặt địa chỉ khác làm mặc định trước.",
      });
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Xóa địa chỉ thành công" });
  } catch (error) {
    console.error("Lỗi xóa địa chỉ:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ================= ĐẶT LÀM MẶC ĐỊNH =================
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Địa chỉ không tồn tại" });
    }

    // 1. Reset tất cả về false
    await Address.updateMany({ user: userId }, { isDefault: false });

    // 2. Set cái này thành true
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { isDefault: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Đã đặt làm địa chỉ mặc định",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi set default:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
