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
      status, // active, pending, rejected...
      sellerId, // Lọc theo Shop cụ thể
      category,
      brand,
      sort = "newest",
    } = req.query;

    // --- 1. Xây dựng bộ lọc ---
    // Mặc định: Admin xem được tất cả, trừ những cái đã Xóa Vĩnh Viễn (Soft deleted = true thì vẫn xem được để khôi phục nếu cần, hoặc lọc ra)
    // Tùy logic bên bạn, ở đây tôi để mặc định chỉ xem cái chưa xóa.
    const filter = { isDeleted: false };

    // Tìm kiếm: Ưu tiên tìm theo Tên (Regex) hoặc tìm trong Text Index
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }, // Tìm cả trong tags
      ];
    }

    if (status) filter.status = status;
    if (sellerId) filter.sellerId = sellerId;
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    // --- 2. Xử lý Sắp xếp ---
    let sortOption = { createdAt: -1 }; // Mặc định mới nhất
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
        break; // Xem sp bán chạy nhất
      case "view":
        sortOption = { views: -1 };
        break; // Nếu có trường view
    }

    // --- 3. Query DB ---
    const products = await Product.find(filter)
      .populate("category", "name slug") // Lấy tên danh mục
      .populate("brand", "name") // Lấy tên thương hiệu
      .populate("sellerId", "username email phone name avatar") // Lấy thông tin Shop/User
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalProducts: total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. GET DETAIL: Xem chi tiết để điều tra
// ==========================================
export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("brand", "name")
      .populate("sellerId", "username email phone name addresses"); // Xem kỹ shop này ở đâu

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
// 3. UPDATE STATUS: Cấm / Duyệt / Từ chối
// ==========================================
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Các giá trị status hợp lệ theo Model:
    // ["active", "pending", "draft", "hidden", "rejected"]

    // Admin thường dùng:
    // - 'rejected': Từ chối duyệt (nếu có quy trình duyệt)
    // - 'hidden' hoặc một trạng thái 'banned' (nếu bạn thêm vào enum): Để khóa sản phẩm vi phạm.
    // Với enum hiện tại của bạn: "rejected" là hợp lý nhất để Cấm bán.

    // Validate enum
    const validStatuses = ["active", "pending", "hidden", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ (active, pending, hidden, rejected)",
      });
    }

    const updateData = { status };

    // Logic phụ: Nếu Admin reject/hidden -> Tự động set isActive = false luôn cho chắc
    if (status === "rejected" || status === "hidden") {
      updateData.isActive = false;
    }
    // Nếu Admin active lại -> Có thể set isActive = true (hoặc để Seller tự bật)
    else if (status === "active") {
      updateData.isActive = true;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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
// Admin dùng khi sản phẩm vi phạm pháp luật nghiêm trọng hoặc spam
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Sử dụng cơ chế Soft Delete có sẵn trong Model (isDeleted)
    const product = await Product.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        isActive: false,
        status: "hidden", // Ẩn luôn status
      },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm thành công (Soft Delete)",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. STATS: Thống kê nhanh cho Dashboard
// ==========================================

export const getProductStats = async (req, res) => {
  try {
    // Thống kê theo Status
    const stats = await Product.aggregate([
      { $match: { isDeleted: false } }, // Chỉ tính các sp chưa xóa
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format dữ liệu trả về cho đẹp
    const result = {
      active: 0,
      pending: 0,
      hidden: 0,
      rejected: 0,
      draft: 0,
      total: 0,
    };

    stats.forEach((item) => {
      if (result.hasOwnProperty(item._id)) {
        result[item._id] = item.count;
      }
      result.total += item.count;
    });

    res.status(200).json({ success: true, stats: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
