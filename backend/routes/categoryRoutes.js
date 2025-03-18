// backend/routes/categoryRoutes.js
const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Lấy tất cả danh mục sản phẩm và sản phẩm liên quan
router.get("/categories", (req, res) => {
  const query = `
    SELECT categories.id AS categoryId, categories.name AS categoryName, categories.description AS categoryDescription,
           products.id AS productId, products.name AS productName, products.description AS productDescription, 
           products.price AS productPrice, products.stock AS productStock, products.imageURL AS productImageURL
    FROM categories
    LEFT JOIN product_categories ON categories.id = product_categories.category_id
    LEFT JOIN products ON product_categories.product_id = products.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi truy vấn dữ liệu" });
    }

    // Cấu trúc lại dữ liệu để trả về theo định dạng danh mục và sản phẩm
    const categories = [];
    results.forEach((row) => {
      const {
        categoryId,
        categoryName,
        categoryDescription,
        productId,
        productName,
        productDescription,
        productPrice,
        productStock,
        productImageURL,
      } = row;

      let category = categories.find((cat) => cat.id === categoryId);
      if (!category) {
        category = {
          id: categoryId,
          name: categoryName,
          description: categoryDescription,
          products: [],
        };
        categories.push(category);
      }

      if (productId) {
        category.products.push({
          id: productId,
          name: productName,
          description: productDescription,
          price: productPrice,
          stock: productStock,
          imageURL: productImageURL,
        });
      }
    });

    res.json(categories); // Trả về dữ liệu danh mục và sản phẩm
  });
});

module.exports = router;
