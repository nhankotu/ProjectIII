import FlashSale from "../../models/FlashSale.js";
import Product from "../../models/Product.js";
import {
  uploadToCloudinary,
  resolveBrand,
  deleteFromCloudinary,
} from "../../utils/productService.js";
// ============================================================
// NHÓM 1: QUẢN LÝ CHIẾN DỊCH (SESSIONS)
// ============================================================

export const createFlashSaleSession = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.",
      });
    }

    let imageUrl = "";

    if (req.files && req.files.images && req.files.images.length > 0) {
      const file = req.files.images[0];

      const result = await uploadToCloudinary(
        file.buffer,
        "flash-sales",
        "image",
      );

      if (result) {
        imageUrl = result.url;
      }
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newSale = await FlashSale.create({
      title,
      startTime,
      endTime,
      image: imageUrl,
      isActive: true,
      products: [],
    });

    res.status(201).json({
      success: true,
      message: "Tạo khung giờ Flash Sale thành công",
      data: newSale,
    });
  } catch (error) {
    console.error("Lỗi tạo Flash Sale:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, includeExpired = "false" } = req.query;
    const now = new Date();
    const query = includeExpired === "true" ? {} : { endTime: { $gt: now } };

    const sessions = await FlashSale.find(query)
      .select("title startTime endTime image isActive products") // Đảm bảo lấy field image
      .sort({ startTime: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await FlashSale.countDocuments(query);
    res.json({
      success: true,
      data: sessions,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// NHÓM 2: XỬ LÝ YÊU CẦU TỪ SELLER (DUYỆT SẢN PHẨM)
// ============================================================

export const getPendingFlashSales = async (req, res) => {
  try {
    const now = new Date();

    const pendingRequests = await FlashSale.aggregate([
      { $match: { endTime: { $gt: now } } },
      { $unwind: "$products" },
      { $match: { "products.status": "pending" } },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      { $unwind: "$productDetail" },
      {
        $lookup: {
          from: "users", // Chỉnh lại nếu collection của bạn là 'shops'
          localField: "products.seller",
          foreignField: "_id",
          as: "sellerDetail",
        },
      },
      { $unwind: "$sellerDetail" },
      {
        $project: {
          _id: 0,
          flashSaleId: "$_id",
          flashSaleTitle: "$title",
          flashSaleBanner: { $ifNull: ["$image", ""] }, // Lấy banner khung giờ
          startTime: 1,
          endTime: 1,
          requestId: "$products._id",
          productName: "$productDetail.name",
          productImage: {
            $ifNull: [
              "$productDetail.thumbnail.url",
              "$productDetail.images.0.url",
              "$productDetail.thumbnail",
              "",
            ],
          },
          originalPrice: "$products.originalPrice",
          salePrice: "$products.salePrice",
          limitQuantity: "$products.limitQuantity",
          currentStock: "$productDetail.stock",
          seller: {
            name: "$sellerDetail.username",
            email: "$sellerDetail.email",
          },
          createdAt: "$products.createdAt",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({ success: true, data: pendingRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveFlashSaleItem = async (req, res) => {
  try {
    const { flashSaleId, requestId } = req.body;
    const now = new Date();

    const flashSale = await FlashSale.findById(flashSaleId);
    if (!flashSale || flashSale.endTime <= now) {
      return res.status(400).json({
        success: false,
        message: "Phiên Flash Sale không hợp lệ hoặc đã kết thúc.",
      });
    }

    const registration = flashSale.products.id(requestId);
    if (!registration)
      return res.status(404).json({ message: "Yêu cầu không tồn tại." });

    const product = await Product.findById(registration.product).lean();
    if (
      !product ||
      product.status === "deleted" ||
      product.status === "hidden"
    ) {
      return res
        .status(400)
        .json({ message: "Sản phẩm đang bị khóa hoặc đã xóa." });
    }

    if (product.stock < registration.limitQuantity) {
      return res.status(400).json({
        message: `Tồn kho không đủ (Còn: ${product.stock}, Đăng ký: ${registration.limitQuantity})`,
      });
    }

    await FlashSale.updateOne(
      { _id: flashSaleId, "products._id": requestId },
      { $set: { "products.$.status": "approved" } },
    );

    res.json({ success: true, message: "Duyệt sản phẩm thành công." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectFlashSaleItem = async (req, res) => {
  try {
    const { flashSaleId, requestId, reason } = req.body;
    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập lý do." });
    }

    const updated = await FlashSale.findOneAndUpdate(
      { _id: flashSaleId, "products._id": requestId },
      {
        $set: {
          "products.$.status": "rejected",
          "products.$.rejectReason": reason,
        },
      },
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu." });

    res.json({ success: true, message: "Đã từ chối sản phẩm." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
