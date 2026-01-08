// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Đảm bảo thư mục tồn tại
const ensureUploadsDir = () => {
  const directories = [
    "uploads/temp",
    "uploads/avatars",
    "uploads/products",
    "uploads/videos",
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

ensureUploadsDir();

// ==================== STORAGE CONFIGURATIONS ====================

// 1. MEMORY STORAGE - cho Cloudinary upload
// KHÔNG tạo global memoryStorage, tạo mới mỗi lần cần

// 2. DISK STORAGE - cho file lưu local
const createDiskStorage = (folder = "temp", prefix = "file") => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folder}/`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });
};

// ==================== UPLOADER FACTORY ====================

const createUploader = (options = {}) => {
  const {
    folder = "temp",
    prefix = "file",
    fileSize = 5 * 1024 * 1024,
    allowedMimes = ["image/", "video/"],
    useMemoryStorage = false,
  } = options;

  console.log(`🔧 Creating uploader - Memory Storage: ${useMemoryStorage}`);
  console.log(`🔧 Options:`, { folder, prefix, fileSize, useMemoryStorage });

  // Tạo storage DỰA TRÊN useMemoryStorage
  let storage;

  if (useMemoryStorage) {
    console.log("🔧 Using MEMORY storage (buffer)");
    storage = multer.memoryStorage(); // ✅ TẠO MỚI MỖI LẦN
  } else {
    console.log("🔧 Using DISK storage (path)");
    storage = createDiskStorage(folder, prefix);
  }

  return multer({
    storage,
    limits: {
      fileSize: fileSize,
    },
    fileFilter: (req, file, cb) => {
      console.log(`🔍 Validating: ${file.originalname} (${file.mimetype})`);

      const isValid = allowedMimes.some((mime) =>
        file.mimetype.startsWith(mime)
      );

      if (isValid) {
        console.log(`✅ Accepted: ${file.originalname}`);
        cb(null, true);
      } else {
        const allowedTypes = allowedMimes.map((mime) => mime.replace("/", ""));
        console.log(`❌ Rejected: ${file.originalname}`);
        cb(
          new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`),
          false
        );
      }
    },
  });
};

// ==================== EXPORTED MIDDLEWARES ====================

// 1. CHO SELLER PRODUCTS - MEMORY STORAGE (Cloudinary)
// THÊM DEBUG VÀO ĐÂY
export const uploadProductFilesMemory = (req, res, next) => {
  console.log("🔍 ========== uploadProductFilesMemory CALLED ==========");
  console.log("🔍 This should use MEMORY storage for Cloudinary");

  const uploader = createUploader({
    fileSize: 50 * 1024 * 1024, // 50MB
    allowedMimes: ["image/", "video/"],
    useMemoryStorage: true, // ✅ MEMORY STORAGE - CỰC KỲ QUAN TRỌNG
  }).fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]);

  uploader(req, res, function (err) {
    if (err) {
      console.error("❌ Multer upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // DEBUG: Kiểm tra files nhận được
    if (req.files) {
      console.log("🔍 Files received in middleware:");
      console.log("- Has images?", !!req.files.images);
      console.log("- Has videos?", !!req.files.videos);

      if (req.files.images) {
        req.files.images.forEach((file, idx) => {
          console.log(`  Image ${idx + 1}:`, {
            name: file.originalname,
            hasBuffer: !!file.buffer,
            bufferLength: file.buffer?.length || 0,
            hasPath: !!file.path,
            path: file.path,
          });
        });
      }
    }

    next();
  });
};

// 2. CHO PUBLIC PRODUCTS - DISK STORAGE (Local)
export const uploadProductFiles = createUploader({
  folder: "products",
  prefix: "product-file",
  fileSize: 50 * 1024 * 1024,
  allowedMimes: ["image/", "video/"],
  useMemoryStorage: false, // ✅ DISK STORAGE
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 5 },
]);

// 3. CHO AVATAR UPLOAD - MEMORY STORAGE
export const uploadAvatarMemory = createUploader({
  fileSize: 5 * 1024 * 1024,
  allowedMimes: ["image/"],
  useMemoryStorage: true,
}).single("avatar");

// 4. CHO SHOP IMAGE - MEMORY STORAGE
export const uploadShopImageMemory = createUploader({
  fileSize: 5 * 1024 * 1024,
  allowedMimes: ["image/"],
  useMemoryStorage: true,
}).single("image");

// 5. CHO AVATAR - DISK STORAGE
export const uploadAvatar = createUploader({
  folder: "avatars",
  prefix: "avatar",
  fileSize: 5 * 1024 * 1024,
  allowedMimes: ["image/"],
  useMemoryStorage: false,
}).single("avatar");

// 6. CHO PRODUCT IMAGES ONLY - DISK STORAGE
export const uploadProductImages = createUploader({
  folder: "products",
  prefix: "product-img",
  fileSize: 10 * 1024 * 1024,
  allowedMimes: ["image/"],
  useMemoryStorage: false,
}).array("images", 10);

// 7. CHO PRODUCT VIDEOS ONLY - DISK STORAGE
export const uploadProductVideos = createUploader({
  folder: "videos",
  prefix: "product-video",
  fileSize: 50 * 1024 * 1024,
  allowedMimes: ["video/"],
  useMemoryStorage: false,
}).array("videos", 5);

// 8. GENERIC UPLOADER
export const createCustomUpload = (options = {}) => {
  return createUploader(options);
};
export const uploadForCloudinary = multer({
  storage: multer.memoryStorage(), // QUAN TRỌNG: memoryStorage()
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    console.log(`☁️ Cloudinary - Checking: ${file.originalname}`);

    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận ảnh và video"), false);
    }
  },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 5 },
]);
// ==================== DEFAULT EXPORT ====================

export default {
  uploadAvatar,
  uploadProductImages,
  uploadProductVideos,
  uploadProductFiles,
  uploadProductFilesMemory,
  uploadAvatarMemory,
  uploadShopImageMemory,
  createCustomUpload,
  uploadForCloudinary,
};
