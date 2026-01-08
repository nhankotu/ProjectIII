import { useEffect, useState } from "react";
import axios from "../../utils/axios"; // hoặc axios thường

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/banners/active");
        setBanners(res.data.data || []);
      } catch (err) {
        console.error("Fetch banners error:", err);
        setError("Không tải được banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return { banners, loading, error };
};
