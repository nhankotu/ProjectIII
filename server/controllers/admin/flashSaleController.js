import FlashSale from "../../models/FlashSale.js";

export const getPendingFlashSales = async (req, res) => {
  try {
    const sales = await FlashSale.find({ status: "pending" })
      .populate("createdBy", "username email")
      .populate({
        path: "products.product",
        // ✅ PHẢI LẤY THÊM thumbnail và images
        select: "name price thumbnail images",
      });

    const formattedData = sales.map((sale) => {
      const saleObj = sale.toObject();

      saleObj.products = saleObj.products.map((item) => {
        if (!item.product) return item;

        const prod = item.product;
        // ✅ ÁP DỤNG LOGIC LẤY ẢNH THÔNG MINH SANG ĐÂY
        let imageUrl = "https://via.placeholder.com/150";

        if (prod.thumbnail && prod.thumbnail.url) {
          imageUrl = prod.thumbnail.url;
        } else if (prod.images && prod.images.length > 0) {
          imageUrl = prod.images[0].url || prod.images[0];
        } else if (typeof prod.thumbnail === "string") {
          imageUrl = prod.thumbnail;
        }

        return {
          ...item,
          product: {
            ...prod,
            thumbnail: imageUrl, // Gán link ảnh cuối cùng vào đây
          },
        };
      });
      return saleObj;
    });

    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const approveFlashSale = async (req, res) => {
  const adminId = req.user._id;

  const sale = await FlashSale.findById(req.params.id);
  if (!sale) return res.status(404).json({ message: "Không tồn tại" });

  sale.status = "approved";
  sale.approvedBy = adminId;

  await sale.save();

  res.json({ success: true, message: "Đã duyệt Flash Sale" });
};
export const rejectFlashSale = async (req, res) => {
  const { reason } = req.body;

  const sale = await FlashSale.findByIdAndUpdate(
    req.params.id,
    {
      status: "rejected",
      rejectReason: reason,
    },
    { new: true }
  );

  res.json({ success: true, data: sale });
};
