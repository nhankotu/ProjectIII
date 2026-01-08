import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useFlashSale = () => {
  const [flashSale, setFlashSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await axios.get(`${API_BASE}/flash-sales/active`);
        if (res.data.success) {
          setFlashSale(res.data.data);
        }
      } catch (err) {
        console.error("Flash sale error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  return { flashSale, loading };
};
