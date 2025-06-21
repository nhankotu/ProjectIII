import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Cho phép truy cập từ mạng nội bộ
    port: 5174, // Cổng bạn đang chạy ứng dụng
  },
});
