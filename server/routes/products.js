import express from "express";
const router = express.Router();

// Route tạm test
router.get("/", (req, res) => {
  res.send("Danh sách sản phẩm");
});

export default router;
