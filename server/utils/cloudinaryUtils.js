// utils/cloudinaryUtils.js
import cloudinary from "../config/cloudinary.js";

// ✅ Hàm upload hỗ trợ cả disk và memory storage
export const uploadToCloudinary = (file, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`📤 Uploading file: ${file.originalname}`);
      console.log(`📊 File info:`, {
        mimetype: file.mimetype,
        size: file.size,
        hasBuffer: !!file.buffer,
        hasPath: !!file.path,
        fieldname: file.fieldname,
      });

      // Cách 1: Upload từ buffer (memory storage)
      if (file.buffer) {
        console.log("📦 Uploading from buffer (memory storage)");
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: resourceType,
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) {
              console.error(`❌ Cloudinary upload error from buffer:`, error);
              reject(error);
            } else {
              console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
              resolve(result);
            }
          }
        );
        uploadStream.end(file.buffer);
      }
      // Cách 2: Upload từ file path (disk storage)
      else if (file.path) {
        console.log("💾 Uploading from file path (disk storage)");
        cloudinary.uploader.upload(
          file.path,
          {
            folder: folder,
            resource_type: resourceType,
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) {
              console.error(`❌ Cloudinary upload error from path:`, error);
              reject(error);
            } else {
              console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
              resolve(result);
            }
          }
        );
      }
      // Cách 3: Upload từ base64 nếu có
      else if (file.base64) {
        console.log("🔤 Uploading from base64");
        cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.base64}`,
          {
            folder: folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              console.error(`❌ Cloudinary upload error from base64:`, error);
              reject(error);
            } else {
              console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
              resolve(result);
            }
          }
        );
      } else {
        console.error("❌ No valid file source found:", file);
        reject(new Error("No valid file source (buffer, path, or base64)"));
      }
    } catch (error) {
      console.error("❌ Error in uploadToCloudinary:", error);
      reject(error);
    }
  });
};

// ✅ Hàm delete từ Cloudinary
export const deleteFromCloudinary = async (files, resourceType = "image") => {
  try {
    for (const file of files) {
      if (file.public_id) {
        await cloudinary.uploader.destroy(file.public_id, {
          resource_type: resourceType,
        });
        console.log(`🗑️ Deleted from Cloudinary: ${file.public_id}`);
      }
    }
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error);
    throw error;
  }
};
