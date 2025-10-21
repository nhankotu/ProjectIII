import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Danh sách đánh giá");
});

export default router;
