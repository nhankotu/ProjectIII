import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useHotProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/hot`);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        setError("Không thể tải sản phẩm hot");
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  return { products, loading, error };
};
