import { useMemo } from "react";

// ✅ DI CHUYỂN TẤT CẢ HELPER FUNCTIONS LÊN ĐẦU FILE
const getProductNameByCategory = (categorySlug) => {
  const names = {
    "dien-thoai": [
      "Galaxy S23",
      "iPhone 15",
      "Redmi Note 12",
      "Find X5",
      "Pixel 7",
    ],
    laptop: [
      "MacBook Pro",
      "ThinkPad X1",
      "Inspiron 15",
      "ZenBook 14",
      "Victus 16",
    ],
    tablet: ["iPad Air", "Galaxy Tab S8", "Mi Pad 5", "MatePad Pro"],
    "phu-kien": [
      "Tai nghe Bluetooth",
      "Sạc nhanh 20W",
      "Ốp lưng chính hãng",
      "Cáp USB-C",
    ],
    "dong-ho": ["Watch Series 8", "Galaxy Watch 5", "Mi Band 7"],
    "am-thanh": ["AirPods Pro", "Sony WH-1000XM5", "JBL Flip 6"],
  };

  const categoryNames = names[categorySlug] || [
    "Pro Max",
    "Ultra",
    "Plus",
    "Lite",
  ];
  return categoryNames[Math.floor(Math.random() * categoryNames.length)];
};

const getDescriptionByCategory = (categorySlug) => {
  const descriptions = {
    "dien-thoai":
      "Camera siêu nét, pin trâu, hiệu năng mạnh mẽ. Thiết kế sang trọng, màn hình chất lượng cao.",
    laptop:
      "Cấu hình mạnh mẽ, màn hình sắc nét, thời lượng pin lâu. Phù hợp cho công việc và giải trí.",
    tablet:
      "Màn hình lớn, hiệu năng ổn định, hoàn hảo cho làm việc và học tập. Hỗ trợ bút cảm ứng.",
    "phu-kien":
      "Chất lượng cao, tương thích hoàn hảo. Thiết kế đẹp mắt, độ bền vượt trội.",
    "dong-ho":
      "Theo dõi sức khỏe, thông báo thông minh. Pin dùng lâu, kết nối ổn định.",
    "am-thanh":
      "Âm thanh sống động, chống ồn chủ động. Thiết kế êm ái, thời lượng pin ấn tượng.",
  };

  return (
    descriptions[categorySlug] ||
    "Sản phẩm chất lượng cao với nhiều tính năng hiện đại."
  );
};

const generateSpecifications = (categorySlug, brand) => {
  const baseSpecs = {
    "Thương hiệu": brand,
    "Bảo hành": "12 tháng",
    "Xuất xứ": "Trung Quốc",
    "Tình trạng": "Mới 100%",
  };

  const specsByCategory = {
    "dien-thoai": {
      "Màn hình": "6.7 inch Super Retina XDR",
      Chip: "A16 Bionic",
      RAM: "6GB",
      "Bộ nhớ": "128GB",
      "Camera sau": "48MP + 12MP + 12MP",
      "Camera trước": "12MP",
      Pin: "4323 mAh",
      "Hệ điều hành": "iOS 16",
    },
    laptop: {
      "Màn hình": "14 inch 2.8K OLED",
      CPU: "Intel Core i7-1260P",
      RAM: "16GB LPDDR5",
      "Ổ cứng": "512GB SSD NVMe",
      "Card đồ họa": "Intel Iris Xe",
      "Cổng kết nối": "2x Thunderbolt 4, HDMI, USB-A",
      "Hệ điều hành": "Windows 11 Home",
      "Trọng lượng": "1.4kg",
    },
    tablet: {
      "Màn hình": "11 inch Liquid Retina",
      Chip: "Apple M1",
      RAM: "8GB",
      "Bộ nhớ": "128GB",
      "Camera sau": "12MP",
      "Camera trước": "12MP Ultra Wide",
      Pin: "28.6 Wh",
      "Hệ điều hành": "iPadOS 16",
    },
  };

  return {
    ...baseSpecs,
    ...(specsByCategory[categorySlug] || {}),
  };
};

// ✅ BÂY GIỜ MỚI ĐẾN HOOK CHÍNH
export const useMockData = () => {
  const mockData = useMemo(() => {
    // Categories data
    const categories = [
      {
        id: 1,
        name: "Điện Thoại",
        slug: "dien-thoai",
        image: "/images/categories/phone.jpg",
        description: "Smartphone chính hãng giá tốt",
        productCount: 156,
      },
      // ... keep the rest of your categories, brands, etc.
      {
        id: 2,
        name: "Laptop",
        slug: "laptop",
        image: "/images/categories/laptop.jpg",
        description: "Laptop gaming, văn phòng",
        productCount: 89,
      },
      {
        id: 3,
        name: "Tablet",
        slug: "tablet",
        image: "/images/categories/tablet.jpg",
        description: "Máy tính bảng đa dạng",
        productCount: 45,
      },
      {
        id: 4,
        name: "Phụ Kiện",
        slug: "phu-kien",
        image: "/images/categories/accessories.jpg",
        description: "Tai nghe, sạc, ốp lưng",
        productCount: 234,
      },
      {
        id: 5,
        name: "Đồng Hồ",
        slug: "dong-ho",
        image: "/images/categories/watch.jpg",
        description: "Smartwatch, đồng hồ thông minh",
        productCount: 67,
      },
      {
        id: 6,
        name: "Âm Thanh",
        slug: "am-thanh",
        image: "/images/categories/audio.jpg",
        description: "Tai nghe, loa, âm thanh",
        productCount: 78,
      },
    ];

    // Brands data
    const brands = [
      { id: 1, name: "Apple", slug: "apple", logo: "/images/brands/apple.png" },
      {
        id: 2,
        name: "Samsung",
        slug: "samsung",
        logo: "/images/brands/samsung.png",
      },
      {
        id: 3,
        name: "Xiaomi",
        slug: "xiaomi",
        logo: "/images/brands/xiaomi.png",
      },
      { id: 4, name: "Oppo", slug: "oppo", logo: "/images/brands/oppo.png" },
      { id: 5, name: "Dell", slug: "dell", logo: "/images/brands/dell.png" },
      { id: 6, name: "HP", slug: "hp", logo: "/images/brands/hp.png" },
      {
        id: 7,
        name: "Lenovo",
        slug: "lenovo",
        logo: "/images/brands/lenovo.png",
      },
      { id: 8, name: "Sony", slug: "sony", logo: "/images/brands/sony.png" },
    ];

    // Generate mock products - BÂY GIỜ CÓ THỂ GỌI TẤT CẢ HELPER FUNCTIONS
    const generateProducts = (count = 50) => {
      return Array.from({ length: count }, (_, index) => {
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const price = Math.floor(Math.random() * 10000000) + 1000000;
        const originalPrice = price + Math.floor(Math.random() * 3000000);
        const discount = Math.round(
          ((originalPrice - price) / originalPrice) * 100
        );
        const rating = (Math.random() * 2 + 3).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 200);
        const soldCount = Math.floor(Math.random() * 500);

        return {
          id: index + 1,
          name: `${brand.name} ${getProductNameByCategory(category.slug)} ${
            index + 1
          }`,
          price: price,
          originalPrice: originalPrice,
          discount: discount > 0 ? discount : 0,
          images: [
            `https://picsum.photos/400/400?random=${index + 1}`,
            `https://picsum.photos/400/400?random=${index + 101}`,
            `https://picsum.photos/400/400?random=${index + 201}`,
            `https://picsum.photos/400/400?random=${index + 301}`,
          ],
          category: category,
          brand: brand.name,
          rating: parseFloat(rating),
          reviewCount: reviewCount,
          soldCount: soldCount,
          description: `Sản phẩm ${
            brand.name
          } chất lượng cao với nhiều tính năng hiện đại. ${getDescriptionByCategory(
            category.slug
          )}`,
          shortDescription: `${brand.name} ${getProductNameByCategory(
            category.slug
          )} - Hiệu suất vượt trội`,
          inStock: Math.random() > 0.1,
          isFeatured: Math.random() > 0.7,
          isHot: Math.random() > 0.8,
          stock: Math.floor(Math.random() * 100) + 10,
          maxQuantity: 10,
          slug: `san-pham-${index + 1}`,
          specifications: generateSpecifications(category.slug, brand.name),
          warranty: "12 tháng",
          createdAt: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
      });
    };

    // ... keep the rest of your banners and flashSales code

    const banners = [
      {
        id: 1,
        title: "Siêu Sale Tháng 12",
        subtitle: "Giảm đến 50%",
        description: "Cơ hội mua sắm với giá tốt nhất",
        image: "/images/banners/banner-1.jpg",
        buttonText: "Mua ngay",
        buttonLink: "/sale",
        backgroundColor: "bg-gradient-to-r from-purple-600 to-blue-600",
      },
      // ... other banners
    ];

    const flashSales = [
      {
        id: 1,
        title: "Flash Sale 12.12",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        discount: 70,
        products: generateProducts(8).map((product) => ({
          ...product,
          flashPrice: product.price * 0.3,
          sold: Math.floor(Math.random() * 50),
          total: 100,
        })),
      },
    ];

    return {
      categories,
      brands,
      products: generateProducts(100),
      banners,
      flashSales,
    };
  }, []);

  return mockData;
};

// ... keep the rest of your individual getters
// ✅ THÊM CÁC EXPORTS INDIVIDUAL GETTERS VÀO CUỐI FILE
export const useCategories = () => {
  const { categories } = useMockData();
  return categories;
};

export const useProductsData = () => {
  const { products } = useMockData();
  return products;
};

export const useFeaturedProducts = () => {
  const { products } = useMockData();
  return products.filter((product) => product.isFeatured);
};

export const useHotProducts = () => {
  const { products } = useMockData();
  return products.filter((product) => product.isHot);
};

export const useBanners = () => {
  const { banners } = useMockData();
  return banners;
};

export const useFlashSales = () => {
  const { flashSales } = useMockData();
  return flashSales;
};
