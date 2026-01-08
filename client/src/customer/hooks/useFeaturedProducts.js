import { useEffect, useState } from "react";
import axios from "@/customer/utils/axios";

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get("/products/featured");
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error("Featured products error:", err);
        setError("Không thể tải sản phẩm nổi bật");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
};
