import cloudinary from "../../config/cloudinary.js";
import Product from "../../models/product.js";
import fs from "fs";

export const uploadProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "products",
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(file.path);

    // Lưu vào MongoDB
    const product = await Product.create({
      name,
      description,
      price,
      images: [result.secure_url],
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
