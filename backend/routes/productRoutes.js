const express = require("express");
const router = express.Router();
const searchProduct = require("../controllers/searchProduct");

router.get("/products/search", searchProduct);

module.exports = router;
