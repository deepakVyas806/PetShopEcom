import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { api, qs } from "@/lib/api";

export default function useProductsList() {
  const searchParams = useSearchParams();
  const { addToCart } = useStore();

  const categoryParam = searchParams.get("category");
  const queryParam    = searchParams.get("query");

  const [selectedPetTypes, setSelectedPetTypes] = useState(categoryParam ? [categoryParam] : []);
  const [priceRange,       setPriceRange]        = useState(100000);
  const [selectedBrands,   setSelectedBrands]    = useState([]);
  const [ratingFilter,     setRatingFilter]      = useState(false);
  const [sortBy,           setSortBy]            = useState("Popularity");
  const [searchQuery,      setSearchQuery]        = useState(queryParam ?? "");
  const [mobileFiltersOpen,setMobileFiltersOpen]  = useState(false);
  const [favorites,        setFavorites]          = useState({});
  const [addedItems,       setAddedItems]         = useState({});

  const [products,    setProducts]    = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(true);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [brands,      setBrands]      = useState([]);

  // Sync URL params → filter state only (no product clear — effect handles replace/append)
  useEffect(() => {
    if (categoryParam) { setSelectedPetTypes([categoryParam]); setPage(1); }
  }, [categoryParam]);
  useEffect(() => {
    setSearchQuery(queryParam ?? "");
    setPage(1);
  }, [queryParam]);

  // Fetch on page or any filter change
  useEffect(() => {
    let cancelled = false;
    if (page === 1) setLoading(true); else setLoadingMore(true);

    const params = {
      page,
      limit:     12,
      sortBy,
      search:    searchQuery || undefined,
      petTypes:  selectedPetTypes.length > 0 ? selectedPetTypes.join(",") : undefined,
      maxPrice:  priceRange < 100000 ? priceRange : undefined,
      minRating: ratingFilter ? 4 : undefined,
      brand:     selectedBrands.length === 1 ? selectedBrands[0] : undefined,
    };

    api.get(`/products${qs(params)}`)
      .then(data => {
        if (cancelled) return;
        const newItems = data.products ?? [];
        setProducts(prev => page === 1 ? newItems : [...prev, ...newItems]);
        setTotalCount(data.total ?? data.totalCount ?? 0);
        setHasMore(page < (data.totalPages ?? 1));
        const uniqueBrands = [...new Set(newItems.map(p => p.brand).filter(Boolean))];
        setBrands(prev => [...new Set([...prev, ...uniqueBrands])]);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) { setLoading(false); setLoadingMore(false); } });

    return () => { cancelled = true; };
  }, [page, sortBy, searchQuery, selectedPetTypes, priceRange, ratingFilter, selectedBrands]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) setPage(p => p + 1);
  }, [loading, loadingMore, hasMore]);

  // Filter setters: reset page to 1 so the effect replaces instead of appending.
  // Do NOT clear products here — loading=true hides stale items during the fetch.
  const handlePetTypeChange = (type) => {
    setSelectedPetTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setPage(1);
  };
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setPage(1);
  };
  const handleSetSortBy         = (s) => { setSortBy(s);         setPage(1); };
  const handleSetSearchQuery    = (q) => { setSearchQuery(q);    setPage(1); };
  const handleSetPriceRange     = (r) => { setPriceRange(r);     setPage(1); };
  const handleSetRatingFilter   = (r) => { setRatingFilter(r);   setPage(1); };

  const toggleFavorite = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  const handleAddToCart = (product) => {
    addToCart(product);
    const id = product._id ?? product.id;
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [id]: false })), 2000);
  };

  return {
    products, totalCount, loading, loadingMore, hasMore, brands,
    selectedPetTypes, handlePetTypeChange,
    priceRange, setPriceRange: handleSetPriceRange,
    selectedBrands, handleBrandChange,
    ratingFilter, setRatingFilter: handleSetRatingFilter,
    sortBy, setSortBy: handleSetSortBy,
    searchQuery, setSearchQuery: handleSetSearchQuery,
    mobileFiltersOpen, setMobileFiltersOpen,
    favorites, toggleFavorite,
    addedItems, handleAddToCart,
    loadMore,
  };
}
