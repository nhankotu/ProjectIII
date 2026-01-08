// routes/banners.js
import express from "express";
import {
  getBanners,
  getActiveBanners,
} from "../../controllers/customer/bannerController.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/active", getActiveBanners);

export default router;
