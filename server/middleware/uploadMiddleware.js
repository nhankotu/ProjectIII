import multer from "multer";
import path from "path";
import fs from "fs";
// Đảm bảo thư mục tồn tại
const ensureUploadsDir = () => {
  const tempDir = "uploads/temp";
  const avatarsDir = "uploads/avatars";

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log("✅ Created temp directory");
  }

  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log("✅ Created avatars directory");
  }
};

// Gọi hàm tạo thư mục
ensureUploadsDir();
// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/temp/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "avatar-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)"), false);
    }
  },
});

export const uploadAvatar = upload.single("avatar");
