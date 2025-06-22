CREATE DATABASE webshop;

-- Tạo bảng account

CREATE TABLE account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
     imgurl VARCHAR(255),
      ifmuser text,
      address VARCHAR(255),
     phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE otp_storage (
  email VARCHAR(255) PRIMARY KEY,  -- Sử dụng email làm khóa chính
  otp VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Tạo bảng products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci,
    price DECIMAL(10, 2) NOT NULL,
    imageURL VARCHAR(255),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
-- Tạo bảng categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Tạo bảng payment
CREATE TABLE payment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_no VARCHAR(50),        -- Mã giao dịch VNPAY
  order_info VARCHAR(255),           -- Thông tin đơn hàng (ví dụ: "Thanh toán đơn hàng")
  payment_method VARCHAR(100),       -- "vnpay"
  bank_code VARCHAR(50),             -- Ví dụ: "NCB"
  amount DECIMAL(10, 2) NOT NULL,    -- Số tiền thanh toán (đơn vị: VND)
  status VARCHAR(50) DEFAULT 'pending', -- "success", "fail", v.v.
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

