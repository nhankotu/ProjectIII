import FlashSale from "../../models/FlashSale.js";

export const getPendingFlashSales = async (req, res) => {
  const sales = await FlashSale.find({ status: "pending" })
    .populate("createdBy", "name email")
    .populate("products.product", "name price");

  res.json({ success: true, data: sales });
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
