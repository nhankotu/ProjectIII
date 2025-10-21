require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const path = require("path");

// Cấu hình Cloudinary từ .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async () => {
  try {
    const imagePath = path.join(__dirname, "public", "images", "test.png");

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "test_uploads", // Tên folder trên Cloudinary
    });

    console.log("Upload successful!");
    console.log("URL:", result.secure_url);
  } catch (err) {
    console.error("Upload error:", err);
  }
};

uploadImage();
