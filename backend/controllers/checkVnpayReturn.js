const db = require("../config/db");
const { VNPay, ignoreLogger } = require("vnpay");

const checkVnpayReturn = async (req, res) => {
  try {
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMNCODE,
      secureSecret: process.env.VNP_SECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const result = await vnpay.verifyReturnUrl(req.query);
    console.log("✅ Kết quả verifyReturnUrl:", result);

    const redirectBase =
      process.env.CLIENT_REDIRECT_URL || "http://localhost:5174/home/cart";

    if (result.isSuccess) {
      // ✅ Lấy dữ liệu cần thiết từ result
      const { vnp_TransactionNo, vnp_OrderInfo, vnp_BankCode, vnp_Amount } =
        result;

      // ✅ Câu SQL: chèn vào bảng payment
      const query = `
        INSERT INTO payment 
          (transaction_no, order_info, payment_method, bank_code, amount, status) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      await db.execute(query, [
        vnp_TransactionNo || null,
        vnp_OrderInfo || null,
        "vnpay",
        vnp_BankCode || null,
        vnp_Amount ? vnp_Amount / 100 : 0,
        "success",
      ]);

      return res.redirect(
        `${redirectBase}?status=success&message=${encodeURIComponent(
          "Thanh toán thành công"
        )}`
      );
    } else {
      return res.redirect(
        `${redirectBase}?status=fail&message=${encodeURIComponent(
          "Thanh toán thất bại hoặc bị hủy"
        )}`
      );
    }
  } catch (error) {
    console.error("❌ Lỗi khi xác nhận thanh toán VNPAY:", error);
    return res
      .status(500)
      .json({ error: "Lỗi khi xác nhận thanh toán VNPAY." });
  }
};

module.exports = checkVnpayReturn;
