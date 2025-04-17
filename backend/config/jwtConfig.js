//jwtConfig.js
const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key"; // Thay đổi bằng chuỗi bí mật của bạn

const issueToken = (userId) => {
  return jwt.sign(
    {
      userId: userId,
      exp: Math.floor(Date.now() / 1000) + 300, // Hết hạn sau 2 phút
    },
    secretKey
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

module.exports = {
  issueToken,
  verifyToken,
};
