const { VNPay, ignoreLogger, ProductCode, dateFormat } = require("vnpay");

const createVnpayUrl = async (req, res) => {
  try {
    const { amount, description } = req.body;

    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Số tiền thanh toán không hợp lệ." });
    }
    if (!description || description.trim() === "") {
      return res
        .status(400)
        .json({ error: "Mô tả đơn hàng không được để trống." });
    }

    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMNCODE,
      secureSecret: process.env.VNP_SECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const paymentParams = {
      vnp_Amount: amount * 100, // VNPAY tính theo đồng nhỏ nhất (đơn vị: xu)
      vnp_IpAddr:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress,
      vnp_TxnRef: "txn" + Date.now(),
      vnp_OrderInfo: description,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl:
        process.env.VNP_RETURN_URL ||
        "http://localhost:5000/api/payment/check-payment-vnpay",
      vnp_Locale: "vn",
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 1000)),
    };

    const vnpayUrl = await vnpay.buildPaymentUrl(paymentParams);

    if (vnpayUrl) {
      return res.status(200).json({ vnpayUrl });
    } else {
      return res
        .status(500)
        .json({ error: "Không thể tạo URL thanh toán VNPAY." });
    }
  } catch (error) {
    console.error("Lỗi tạo URL thanh toán VNPAY:", error);
    return res.status(500).json({ error: "Lỗi khi tạo URL thanh toán VNPAY." });
  }
};

module.exports = createVnpayUrl;
