import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("🔧 Credentials from .env:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET
    ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4)
    : "NOT SET"
);

async function testUpload() {
  try {
    // Config với credentials từ .env
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("🔄 Config set from .env, uploading...");

    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      {
        folder: "test_env",
        timeout: 30000,
      }
    );

    console.log("✅ UPLOAD SUCCESS WITH .env!");
    console.log("URL:", result.secure_url);
  } catch (error) {
    console.error("❌ UPLOAD FAILED:", error.message);
  }
}

testUpload();
