const db = require("../config/db"); // Giả sử bạn đã kết nối mysql2 pool hoặc connection

const searchProduct = (req, res) => {
  const keyword = req.query.keyword || "";

  const query = `
    SELECT * FROM products 
    WHERE name LIKE ? OR description LIKE ?
  `;
  const searchValue = `%${keyword}%`;

  db.query(query, [searchValue, searchValue], (err, results) => {
    if (err) {
      console.error("Lỗi tìm kiếm sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    res.json(results);
  });
};

module.exports = searchProduct;
