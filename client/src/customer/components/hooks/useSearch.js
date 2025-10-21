import { useState, useCallback } from "react";
import { useProducts } from "./useProducts";

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { products } = useProducts();

  const searchProducts = useCallback(
    (query, filters = {}) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      setSearchQuery(query);

      // Simulate API search delay
      setTimeout(() => {
        const results = products.filter((product) => {
          const searchTerm = query.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(searchTerm);
          const matchesBrand = product.brand
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesCategory = product.category?.name
            .toLowerCase()
            .includes(searchTerm);
          const matchesDescription = product.description
            ?.toLowerCase()
            .includes(searchTerm);

          return (
            matchesName || matchesBrand || matchesCategory || matchesDescription
          );
        });

        // Apply additional filters
        let filteredResults = results;

        if (filters.category) {
          filteredResults = filteredResults.filter(
            (product) => product.category?.slug === filters.category
          );
        }

        if (filters.minPrice) {
          filteredResults = filteredResults.filter(
            (product) => product.price >= filters.minPrice
          );
        }

        if (filters.maxPrice) {
          filteredResults = filteredResults.filter(
            (product) => product.price <= filters.maxPrice
          );
        }

        if (filters.inStock) {
          filteredResults = filteredResults.filter(
            (product) => product.inStock
          );
        }

        if (filters.sortBy) {
          filteredResults = sortSearchResults(filteredResults, filters.sortBy);
        }

        setSearchResults(filteredResults);
        setSearchLoading(false);
      }, 500);
    },
    [products]
  );

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  const getSearchSuggestions = useCallback(
    (query) => {
      if (!query.trim() || query.length < 2) return [];

      const suggestions = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category?.name,
          image: product.images?.[0],
        }));

      return suggestions;
    },
    [products]
  );

  return {
    searchResults,
    searchLoading,
    searchQuery,
    searchProducts,
    clearSearch,
    getSearchSuggestions,
  };
};

const sortSearchResults = (results, sortBy) => {
  const sorted = [...results];

  switch (sortBy) {
    case "relevance":
      return sorted; // Default order from search
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating_desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};
