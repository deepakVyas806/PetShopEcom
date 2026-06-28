import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { api, qs } from "@/lib/api";

// Convert a catalog item to the {key, label} shape FilterPanel expects
function itemsToOptions(items) {
  return items.map(i => ({ key: i.slug, label: i.name }));
}

export default function useProductsList() {
  const searchParams = useSearchParams();
  const { addToCart } = useStore();
  const { isAuthenticated } = useAuth();

  const categoryParam = searchParams.get("category");
  const typeParam     = searchParams.get("type");
  const queryParam    = searchParams.get("query");
  const brandParam    = searchParams.get("brand");

  const [selectedPetTypes,   setSelectedPetTypes]   = useState(categoryParam ? [categoryParam] : []);
  const [selectedCategories, setSelectedCategories] = useState(typeParam ? [typeParam] : []);
  const [priceRange,         setPriceRange]         = useState(5000);
  const [selectedBrands,     setSelectedBrands]     = useState(brandParam ? [brandParam] : []);
  const [ratingFilter,       setRatingFilter]       = useState(false);
  const [sortBy,             setSortBy]             = useState("Popularity");
  const [searchQuery,        setSearchQuery]        = useState(queryParam ?? "");
  const [mobileFiltersOpen,  setMobileFiltersOpen]  = useState(false);
  const [favorites,          setFavorites]          = useState({});
  const [addedItems,         setAddedItems]         = useState({});

  const [products,         setProducts]         = useState([]);
  const [totalCount,       setTotalCount]       = useState(0);
  const [page,             setPage]             = useState(1);
  const [hasMore,          setHasMore]          = useState(false);
  const [loading,          setLoading]          = useState(true);
  const [loadingMore,      setLoadingMore]      = useState(false);
  const [brands,           setBrands]           = useState([]);
  const [petTypeOptions,   setPetTypeOptions]   = useState([]);
  const [categoryOptions,  setCategoryOptions]  = useState([]);

  // Fetch catalog options for filter panel (once on mount — ref guard prevents StrictMode double-fetch)
  const catalogFetchedRef = useRef(false);
  useEffect(() => {
    if (catalogFetchedRef.current) return;
    catalogFetchedRef.current = true;
    Promise.all([
      api.get("/catalog?type=petType"),
      api.get("/catalog?type=category"),
      api.get("/catalog?type=brand"),
    ]).then(([pets, cats, brs]) => {
      if (pets.items?.length) setPetTypeOptions(itemsToOptions(pets.items));
      if (cats.items?.length) setCategoryOptions(itemsToOptions(cats.items));
      if (brs.items?.length)  setBrands(itemsToOptions(brs.items));
    }).catch(() => {}); // silently fall back to hardcoded defaults in FilterPanel
  }, []);

  // Sync URL params → filter state
  useEffect(() => {
    if (categoryParam) { setSelectedPetTypes([categoryParam]); setPage(1); }
  }, [categoryParam]);
  useEffect(() => {
    if (typeParam) { setSelectedCategories([typeParam]); setPage(1); }
  }, [typeParam]);
  useEffect(() => {
    setSearchQuery(queryParam ?? "");
    setPage(1);
  }, [queryParam]);
  useEffect(() => {
    if (brandParam) { setSelectedBrands([brandParam]); setPage(1); }
  }, [brandParam]);

  // Fetch on page or any filter change
  useEffect(() => {
    let cancelled = false;
    if (page === 1) setLoading(true); else setLoadingMore(true);

    const params = {
      page,
      limit:     10,
      sortBy,
      search:    searchQuery || undefined,
      petTypes:  selectedPetTypes.length  > 0 ? selectedPetTypes.join(",")   : undefined,
      type:      selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
      maxPrice:  priceRange < 5000 ? priceRange : undefined,
      minRating: ratingFilter ? 4 : undefined,
      brands:    selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
    };

    api.get(`/products${qs(params)}`)
      .then(data => {
        if (cancelled) return;
        const newItems = data.products ?? [];
        setProducts(prev => page === 1 ? newItems : [...prev, ...newItems]);
        const total = data.total ?? data.totalCount ?? 0;
        setTotalCount(total);
        // Derive totalPages from API field, or calculate from total/limit
        const totalPg = data.totalPages ?? (total > 0 ? Math.ceil(total / 10) : 1);
        setHasMore(page < totalPg);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) { setLoading(false); setLoadingMore(false); } });

    return () => { cancelled = true; };
  }, [page, sortBy, searchQuery, selectedPetTypes, selectedCategories, priceRange, ratingFilter, selectedBrands]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) setPage(p => p + 1);
  }, [loading, loadingMore, hasMore]);

  const handlePetTypeChange = useCallback((type) => {
    setSelectedPetTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setPage(1);
  }, []);
  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  }, []);
  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setPage(1);
  }, []);
  const handleSetSortBy       = useCallback((s) => { setSortBy(s);       setPage(1); }, []);
  const handleSetSearchQuery  = useCallback((q) => { setSearchQuery(q);  setPage(1); }, []);
  const handleSetPriceRange   = useCallback((r) => { setPriceRange(r);   setPage(1); }, []);
  const handleSetRatingFilter = useCallback((r) => { setRatingFilter(r); setPage(1); }, []);

  // Load existing wishlist on mount so hearts are pre-filled
  const wishlistFetchedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || wishlistFetchedRef.current) return;
    wishlistFetchedRef.current = true;
    api.get("/wishlists")
      .then(data => {
        const map = {};
        (data.items ?? []).forEach(item => { map[item._id ?? item.id] = true; });
        setFavorites(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (isAuthenticated) {
        if (next[id]) {
          api.post("/wishlists", { productId: id }).catch(() => {});
        } else {
          api.delete(`/wishlists/${id}`).catch(() => {});
        }
      }
      return next;
    });
  }, [isAuthenticated]);
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    const id = product._id ?? product.id;
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [id]: false })), 2000);
  }, [addToCart]);

  return {
    products, totalCount, loading, loadingMore, hasMore, brands,
    petTypeOptions, categoryOptions,
    selectedPetTypes,   handlePetTypeChange,
    selectedCategories, handleCategoryChange,
    priceRange,         setPriceRange: handleSetPriceRange,
    selectedBrands,     handleBrandChange,
    ratingFilter,       setRatingFilter: handleSetRatingFilter,
    sortBy,             setSortBy: handleSetSortBy,
    searchQuery,        setSearchQuery: handleSetSearchQuery,
    mobileFiltersOpen,  setMobileFiltersOpen,
    favorites,          toggleFavorite,
    addedItems,         handleAddToCart,
    loadMore,
  };
}
