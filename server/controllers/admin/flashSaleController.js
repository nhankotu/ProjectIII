import FlashSale from "../../models/FlashSale.js";

// Lấy danh sách các sản phẩm đang chờ duyệt trong tất cả các khung giờ
export const getPendingFlashSales = async (req, res) => {
  try {
    // 1. Tìm các Flash Sale có chứa ít nhất 1 sản phẩm đang pending
    const sales = await FlashSale.find({ "products.status": "pending" })
      .populate("products.product", "name price thumbnail images") // Lấy info sản phẩm
      .populate("products.seller", "name email"); // Lấy info người bán (QUAN TRỌNG)

    // 2. Làm phẳng dữ liệu (Flatten) để hiển thị dạng danh sách yêu cầu
    let pendingRequests = [];

    sales.forEach((sale) => {
      // Lọc ra chỉ những item đang pending trong khung giờ này
      const pendingItems = sale.products.filter(
        (item) => item.status === "pending"
      );

      pendingItems.forEach((item) => {
        // Logic xử lý ảnh (giữ nguyên logic của bạn)
        const prod = item.product;
        let imageUrl = "https://via.placeholder.com/150";
        if (prod) {
          if (prod.thumbnail && prod.thumbnail.url) {
            imageUrl = prod.thumbnail.url;
          } else if (prod.images && prod.images.length > 0) {
            imageUrl = prod.images[0].url || prod.images[0];
          } else if (typeof prod.thumbnail === "string") {
            imageUrl = prod.thumbnail;
          }
        }

        // Đẩy vào mảng kết quả
        pendingRequests.push({
          flashSaleId: sale._id, // ID của đợt Flash Sale
          flashSaleTitle: sale.title, // Tên đợt (VD: Khung 9h-11h)
          startTime: sale.startTime,

          requestId: item._id, // ID của dòng đăng ký này (để gửi lên API duyệt)
          seller: item.seller, // Thông tin người bán

          productName: prod ? prod.name : "Sản phẩm đã bị xóa",
          productImage: imageUrl,
          originalPrice: item.originalPrice,
          salePrice: item.salePrice,
          limitQuantity: item.limitQuantity,
          createdAt: item.createdAt, // Ngày gửi yêu cầu
        });
      });
    });

    res.json({ success: true, data: pendingRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveFlashSale = async (req, res) => {
  try {
    const { flashSaleId, requestId } = req.body; // requestId là _id của item trong mảng products

    // Tìm FlashSale có _id đó VÀ chứa product có _id là requestId
    const updatedSale = await FlashSale.findOneAndUpdate(
      {
        _id: flashSaleId,
        "products._id": requestId,
      },
      {
        $set: {
          "products.$.status": "approved", // Dấu $ đại diện cho phần tử tìm thấy
          "products.$.rejectReason": "", // Xóa lý do từ chối nếu có
        },
      },
      { new: true } // Trả về data mới sau update
    );

    if (!updatedSale) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu này" });
    }

    res.json({ success: true, message: "Đã duyệt sản phẩm vào Flash Sale" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectFlashSale = async (req, res) => {
  try {
    const { flashSaleId, requestId, reason } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập lý do từ chối" });
    }

    const updatedSale = await FlashSale.findOneAndUpdate(
      {
        _id: flashSaleId,
        "products._id": requestId,
      },
      {
        $set: {
          "products.$.status": "rejected",
          "products.$.rejectReason": reason,
        },
      },
      { new: true }
    );

    if (!updatedSale) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu này" });
    }

    res.json({ success: true, message: "Đã từ chối sản phẩm" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
