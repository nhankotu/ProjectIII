# Project2

Cài đặt các thư viện cần thiết
npm install

Cài đặt Vite
npm install @vitejs/plugin-react --save-dev

Cài đặt Tailwindcss
Cài đặt nodeJS
Cài đặt Mysql
Chạy file mysql.sql
Thay đổi các trường
host: "localhost", // Địa chỉ server MySQL
user: "root", // Tên người dùng của bạn
password: "123456", // Mật khẩu của bạn
database: "webshop", // Tên cơ sở dữ liệu
thành các tài khoản mật khẩu mà bạn dùng trong my sql

tạo ra file .evn trong backend
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=webshop
PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=youemail.com
EMAIL_PASS=...........
Dùng mật khẩu ứng dụng của email
VNP_TMNCODE=............
VNP_SECRET=................
Đăng ký tài khoản VNPay test để lấy VNP_TMCODE Và VNP_SECRET
VNP_RETURN_URL=http://localhost:5000/api/payment/check-payment-vnpay

# Câu lệnh để chạy Từ thư mục Project2

cd backend
node server.js

cd frontend
npm run dev
