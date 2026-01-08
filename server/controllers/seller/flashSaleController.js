import FlashSale from "../../models/FlashSale.js";
import Product from "../../models/Product.js";

// ➕ Gửi yêu cầu Flash Sale mới
export const createFlashSaleRequest = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { title, startTime, endTime, products } = req.body;

    // 1. Validate dữ liệu đầu vào
    if (!title || !startTime || !endTime || !products?.length) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu" });
    }

    // 2. Validate từng sản phẩm
    const validatedProducts = [];

    for (const item of products) {
      // 🔍 CHECK KỸ: Phải là sản phẩm của Seller, đang Active, chưa xóa, đã duyệt
      const product = await Product.findOne({
        _id: item.product,
        sellerId,
        isActive: true,
        isDeleted: false,
        status: "active",
      });

      if (!product) {
        return res.status(400).json({
          message: `Sản phẩm ID ${item.product} không hợp lệ (Không tồn tại, đã bị xóa hoặc chưa được duyệt).`,
        });
      }

      // Check giá giảm
      if (item.salePrice >= product.price) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}": Giá Flash Sale (${item.salePrice}) phải thấp hơn giá bán hiện tại (${product.price}).`,
        });
      }

      // Check tồn kho (Không cho phép sale vượt quá tồn kho hiện tại)
      if (item.limitQuantity > product.stock) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}": Số lượng đăng ký (${item.limitQuantity}) vượt quá tồn kho (${product.stock}).`,
        });
      }

      validatedProducts.push({
        product: product._id,
        originalPrice: product.price, // Snapshot giá gốc hiện tại
        salePrice: item.salePrice,
        limitQuantity: item.limitQuantity || 10, // Mặc định 10 nếu không nhập
        soldQuantity: 0,
      });
    }

    // 3. Tạo Flash Sale
    const flashSale = await FlashSale.create({
      title,
      startTime,
      endTime,
      products: validatedProducts,
      createdBy: sellerId,
      status: "pending", // Mặc định chờ Admin duyệt
    });

    res.status(201).json({
      success: true,
      message:
        "Đã gửi yêu cầu Flash Sale thành công. Vui lòng chờ Admin phê duyệt.",
      data: flashSale,
    });
  } catch (err) {
    console.error("Lỗi tạo Flash Sale:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📋 Lấy danh sách Flash Sale của Seller
export const getSellerFlashSales = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const sales = await FlashSale.find({ createdBy: sellerId })
      .populate({
        path: "products.product",
        select: "name price thumbnail images stock", // Lấy đủ info để hiện
      })
      .sort({ createdAt: -1 });

    // Format lại dữ liệu để xử lý ảnh (tránh lỗi Frontend)
    const formattedSales = sales.map((sale) => {
      const saleObj = sale.toObject();

      saleObj.products = saleObj.products.map((item) => {
        // Trường hợp sản phẩm bị xóa cứng (null)
        if (!item.product) return item;

        return {
          ...item,
          product: {
            ...item.product,
            thumbnail: getProductImage(item.product), // ✅ Xử lý ảnh
          },
        };
      });

      return saleObj;
    });

    res.json({ success: true, data: formattedSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
