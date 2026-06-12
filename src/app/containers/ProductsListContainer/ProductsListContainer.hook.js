import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { api, qs } from "@/lib/api";

export default function useProductsList() {
  const searchParams = useSearchParams();
  const { addToCart } = useStore();

  const categoryParam = searchParams.get("category");
  const queryParam    = searchParams.get("query");

  const [selectedPetTypes, setSelectedPetTypes] = useState(categoryParam ? [categoryParam] : ["dogs"]);
  const [priceRange,       setPriceRange]        = useState(100000);
  const [selectedBrands,   setSelectedBrands]    = useState([]);
  const [ratingFilter,     setRatingFilter]      = useState(false);
  const [sortBy,           setSortBy]            = useState("Popularity");
  const [searchQuery,      setSearchQuery]        = useState(queryParam ?? "");
  const [currentPage,      setCurrentPage]        = useState(1);
  const [mobileFiltersOpen,setMobileFiltersOpen]  = useState(false);
  const [favorites,        setFavorites]          = useState({});
  const [addedItems,       setAddedItems]         = useState({});

  const [products,    setProducts]    = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [brands,      setBrands]      = useState([]);

  // Sync URL params → state
  useEffect(() => { if (categoryParam) setSelectedPetTypes([categoryParam]); }, [categoryParam]);
  useEffect(() => { setSearchQuery(queryParam ?? ""); }, [queryParam]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page:      currentPage,
        limit:     12,
        sortBy,
        search:    searchQuery || undefined,
        petTypes:  selectedPetTypes.join(","),
        maxPrice:  priceRange < 100000 ? priceRange : undefined,
        minRating: ratingFilter ? 4 : undefined,
        brand:     selectedBrands.length === 1 ? selectedBrands[0] : undefined,
      };
      const data = await api.get(`/products${qs(params)}`);
      setProducts(data.products ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 1);
      // Collect unique brands from results for the filter sidebar
      const uniqueBrands = [...new Set((data.products ?? []).map(p => p.brand).filter(Boolean))];
      setBrands(prev => [...new Set([...prev, ...uniqueBrands])]);
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, searchQuery, selectedPetTypes, priceRange, ratingFilter, selectedBrands]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handlePetTypeChange = (type) => {
    setSelectedPetTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setCurrentPage(1);
  };
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setCurrentPage(1);
  };
  const toggleFavorite = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems(prev => ({ ...prev, [product._id ?? product.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id ?? product.id]: false })), 2000);
  };

  return {
    products, totalCount, totalPages, loading, brands,
    selectedPetTypes, handlePetTypeChange,
    priceRange, setPriceRange,
    selectedBrands, handleBrandChange,
    ratingFilter, setRatingFilter,
    sortBy, setSortBy,
    searchQuery, setSearchQuery: (q) => { setSearchQuery(q); setCurrentPage(1); },
    currentPage, setCurrentPage,
    mobileFiltersOpen, setMobileFiltersOpen,
    favorites, toggleFavorite,
    addedItems, handleAddToCart,
  };
}
