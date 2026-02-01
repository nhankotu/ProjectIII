import Product from "../../models/Product.js";

// ==========================================
// 1. GET ALL: Tra cứu & Soát lỗi (Advanced Filter)
// ==========================================
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sellerId,
      category,
      brand,
      sort = "newest",
    } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: "deleted" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (sellerId) filter.sellerId = sellerId;
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    let sortOption = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "sold":
        sortOption = { sold: -1 };
        break;
      case "rating":
        sortOption = { ratingAverage: -1 };
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("brand", "name")
        .populate("sellerId", "username email phone name avatar")
        .sort(sortOption)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalProducts: total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. GET DETAIL: Xem chi tiết
// ==========================================
export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("brand", "name")
      .populate("sellerId", "username email phone name"); // Bỏ 'addresses' nếu User Model không có, hoặc cứ để nếu có

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. UPDATE STATUS: Duyệt / Cấm / Khôi phục
// ==========================================
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Enum hợp lệ trong Model mới:
    // ["active", "draft", "hidden", "rejected", "deleted"]
    const validStatuses = ["active", "hidden", "rejected", "draft"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Trạng thái không hợp lệ. Chỉ chấp nhận: active, hidden, rejected",
      });
    }

    // Cập nhật trực tiếp status (Không cần xử lý isActive nữa)
    const product = await Product.findByIdAndUpdate(
      id,
      { status: status },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái thành: ${status}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. DELETE: Xóa mềm (Soft Delete)
// ==========================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Sử dụng enum "deleted" thay vì boolean isDeleted
    const product = await Product.findByIdAndUpdate(
      id,
      {
        status: "deleted",
      },
      { new: true },
    );

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm thành công (Chuyển sang trạng thái deleted)",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. STATS: Thống kê nhanh
// ==========================================
export const getProductStats = async (req, res) => {
  try {
    // Thống kê group theo field 'status'
    const stats = await Product.aggregate([
      // Bước 1: Lọc bỏ các sản phẩm đã xóa (nếu không muốn tính vào thống kê)
      // { $match: { status: { $ne: "deleted" } } },

      // Bước 2: Group
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format dữ liệu trả về mặc định bằng 0 nếu chưa có
    const result = {
      active: 0,
      draft: 0,
      hidden: 0,
      rejected: 0,
      deleted: 0,
      total: 0,
    };

    stats.forEach((item) => {
      // item._id là status (vd: "active"), item.count là số lượng
      if (result.hasOwnProperty(item._id)) {
        result[item._id] = item.count;
      }
      // Tính tổng tất cả (bao gồm cả deleted nếu bước $match trên không lọc)
      result.total += item.count;
    });

    res.status(200).json({ success: true, stats: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
