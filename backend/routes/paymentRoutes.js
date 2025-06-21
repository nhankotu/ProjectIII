const express = require("express");
const router = express.Router();
const createVnpayUrl = require("../controllers/createVnpayUrl");
const checkVnpayReturn = require("../controllers/checkVnpayReturn");

router.post("/create-vnpay", createVnpayUrl);
router.get("/check-payment-vnpay", checkVnpayReturn);

module.exports = router;
