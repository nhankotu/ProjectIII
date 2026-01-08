import { useState, useEffect } from "react";
import { useProducts } from "./useProducts";

export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getProductById, getRelatedProducts } = useProducts();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        // Mock API call for detailed product data
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundProduct = getProductById(parseInt(productId));

        if (foundProduct) {
          // Enhance with detailed data
          const detailedProduct = {
            ...foundProduct,
            specifications: generateSpecifications(foundProduct),
            images: [
              foundProduct.images[0],
              `https://picsum.photos/400/400?random=${productId}1`,
              `https://picsum.photos/400/400?random=${productId}2`,
              `https://picsum.photos/400/400?random=${productId}3`,
            ],
            variants: generateVariants(foundProduct),
            reviews: generateReviews(),
            warranty: "12 tháng",
            returnPolicy: "Đổi trả trong 30 ngày",
            shipping: "Miễn phí vận chuyển",
          };

          setProduct(detailedProduct);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm");
        console.error("Fetch product detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId, getProductById]);

  const relatedProducts = product ? getRelatedProducts(product.id) : [];

  return {
    product,
    loading,
    error,
    relatedProducts,
  };
};

// Helper functions
const generateSpecifications = (product) => {
  const baseSpecs = {
    "Thương hiệu": product.brand,
    "Danh mục": product.category?.name,
    "Tình trạng": product.inStock ? "Còn hàng" : "Hết hàng",
    "Bảo hành": "12 tháng",
  };

  if (product.category?.slug === "dien-thoai") {
    return {
      ...baseSpecs,
      "Màn hình": "6.1 inch",
      "Camera sau": "12MP",
      "Camera trước": "12MP",
      Chip: "A15 Bionic",
      RAM: "4GB",
      "Bộ nhớ trong": "128GB",
      Pin: "3240 mAh",
    };
  }

  if (product.category?.slug === "laptop") {
    return {
      ...baseSpecs,
      "Màn hình": "15.6 inch",
      CPU: "Intel Core i5",
      RAM: "8GB",
      "Ổ cứng": "512GB SSD",
      "Card đồ họa": "Intel Iris Xe",
      "Hệ điều hành": "Windows 11",
    };
  }

  return baseSpecs;
};

const generateVariants = (product) => {
  if (product.category?.slug === "dien-thoai") {
    return [
      { id: 1, name: "128GB", price: product.price, stock: 10 },
      { id: 2, name: "256GB", price: product.price + 2000000, stock: 5 },
      { id: 3, name: "512GB", price: product.price + 4000000, stock: 2 },
    ];
  }

  return [
    { id: 1, name: "Mặc định", price: product.price, stock: product.stock },
  ];
};

const generateReviews = () => {
  const reviews = [];
  const comments = [
    "Sản phẩm rất tốt, đúng như mô tả",
    "Giao hàng nhanh, đóng gói cẩn thận",
    "Chất lượng tốt, sẽ ủng hộ lần sau",
    "Sản phẩm đẹp, giá cả hợp lý",
    "Hài lòng với trải nghiệm mua sắm",
  ];

  for (let i = 0; i < 5; i++) {
    reviews.push({
      id: i + 1,
      user: `Người dùng ${i + 1}`,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      comment: comments[Math.floor(Math.random() * comments.length)],
      date: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      verified: Math.random() > 0.3,
    });
  }

  return reviews;
};
