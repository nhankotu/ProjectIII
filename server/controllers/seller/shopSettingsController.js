import Shop from "../../models/Shop.js"; // Import đúng Model Shop mới
import cloudinary from "../../config/cloudinary.js";

// ================= LẤY THÔNG TIN SHOP =================
export const getShopSettings = async (req, res) => {
  try {
    const sellerId = req.user.id; // Lấy ID user từ token

    // 1. Tìm Shop theo 'owner' thay vì 'sellerId'
    let shop = await Shop.findOne({ owner: sellerId });

    // 2. Nếu chưa có Shop, tạo Shop mặc định (Dạng Draft)
    if (!shop) {
      console.log("📝 Creating new shop for seller:", sellerId);

      // Tạo tên shop tạm thời (vì name required & unique)
      const defaultName = `Shop của ${req.user.name || "bạn"} ${Date.now()
        .toString()
        .slice(-4)}`;

      shop = await Shop.create({
        owner: sellerId,
        name: defaultName,
        contact: {
          phone: req.user.phone || "09xxxxxxxxx", // Placeholder để qua validate
          address: "Chưa cập nhật",
        },
        // Các trường khác sẽ lấy default từ Model
      });
    }

    res.json({
      success: true,
      message: "Lấy thông tin Shop thành công",
      data: shop,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin Shop:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// ================= CẬP NHẬT SHOP =================
export const updateShopSettings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const updateData = req.body; // Dữ liệu gửi lên phải khớp cấu trúc Model

    console.log("🔄 Updating shop for owner:", sellerId);

    // Xử lý riêng cho Category (nếu gửi lên chuỗi rỗng thì xóa để tránh lỗi ObjectId)
    if (updateData.category === "") {
      delete updateData.category;
    }

    // Tìm và cập nhật
    const shop = await Shop.findOneAndUpdate(
      { owner: sellerId },
      { $set: updateData },
      {
        new: true, // Trả về data mới
        runValidators: true, // Chạy validate (check unique name, required...)
      }
    );

    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy Shop của bạn" });
    }

    res.json({
      success: true,
      message: "Cập nhật Shop thành công",
      data: shop,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật Shop:", error);

    // Xử lý lỗi trùng tên Shop
    if (error.code === 11000 && error.keyPattern?.name) {
      return res.status(400).json({
        success: false,
        message: "Tên Shop này đã được sử dụng. Vui lòng chọn tên khác.",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPLOAD LOGO/BANNER =================
export const uploadShopImage = async (req, res) => {
  let type;
  try {
    const sellerId = req.user.id;
    type = req.body.type; // 'logo' hoặc 'banner'
    const file = req.file;

    // 1. Validate Input
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: "Chưa chọn file ảnh" });
    if (!["logo", "banner"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Type phải là 'logo' hoặc 'banner'" });
    }

    // 2. Upload lên Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `shop-images/${sellerId}`,
          resource_type: "image",
          transformation:
            type === "logo"
              ? [{ width: 300, height: 300, crop: "fill" }] // Logo vuông
              : [{ width: 1200, height: 400, crop: "fill" }], // Banner dài
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    // 3. Cập nhật URL vào DB (Trực tiếp vào root, không qua basicInfo)
    // Dynamic Key: nếu type='logo' -> update { logo: ... }
    const shop = await Shop.findOneAndUpdate(
      { owner: sellerId },
      { $set: { [type]: result.secure_url } },
      { new: true }
    );

    res.json({
      success: true,
      message: `Cập nhật ${type} thành công`,
      data: {
        imageUrl: result.secure_url,
        shop: shop,
      },
    });
  } catch (error) {
    console.error(`❌ Lỗi upload ${type}:`, error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi upload ảnh" });
  }
};
