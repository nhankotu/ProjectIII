// swagger-gen.js
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "MyStore API",
    description: "Tài liệu API tự động tạo cho dự án MyStore",
  },
  host: "localhost:5000", // Đổi port nếu server bạn chạy port khác
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./swagger-output.json"; // File JSON sẽ được tạo ra tại đây
const routes = ["./server.js"]; // File khởi điểm để quét code

/* Lệnh này sẽ quét toàn bộ code từ server.js và các file routes con
   để tạo ra file swagger-output.json
*/
swaggerAutogen()(outputFile, routes, doc);
