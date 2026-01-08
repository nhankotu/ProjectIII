import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", // Chuẩn OpenAPI
    info: {
      title: "Tài liệu API MyStore",
      version: "1.0.0",
      description: "API cho dự án thương mại điện tử",
    },
    servers: [
      {
        url: "http://localhost:5000", // Link server của bạn
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // ⚠️ QUAN TRỌNG: Đường dẫn đến các file chứa comment docs API
  // Bạn cần trỏ đúng vào nơi bạn viết router
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
