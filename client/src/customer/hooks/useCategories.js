import { useEffect, useState } from "react";
import axios from "../../utils/axios"; // hoặc axios thường nếu bạn chưa có wrapper

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Fetch categories error:", err);
        setError("Không tải được danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
