// src/hooks/useProductDetail.js
import { useState, useEffect } from "react";
import { productApi } from "../services/api";

export const useProductDetail = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await productApi.getDetail(id);
        if (res.success) {
          setProduct(res.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải chi tiết sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  return { product, loading, error };
};
