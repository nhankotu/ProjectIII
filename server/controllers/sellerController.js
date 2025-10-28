import Product from "../models/product.js";

// ✅ Lấy danh sách sản phẩm của seller
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user?._id || req.query.sellerId; // tuỳ theo auth
    const products = await Product.find({ sellerId });
    res.json(products);
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

// ✅ Thêm sản phẩm mới
export const addSellerProduct = async (req, res) => {
  try {
    const sellerId = req.user?._id || "6710c9b15e4b1dcd8fd7d111"; // tạm sellerId test
    const { name, description, price, images, videos } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      videos,
      sellerId,
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    console.error("❌ Lỗi thêm sản phẩm:", err);
    res.status(500).json({ message: "Không thể thêm sản phẩm" });
  }
};
