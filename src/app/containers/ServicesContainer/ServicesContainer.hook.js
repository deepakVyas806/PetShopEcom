"use client";

import { useState, useEffect, useCallback } from "react";
import { IconInfinity, IconGroom, IconMedical, IconTraining, IconHome } from "@/lib/icons";
import { api, qs } from "@/lib/api";

export const CATEGORIES = [
  { key: "all",        label: "All Services", Icon: IconInfinity },
  { key: "grooming",   label: "Grooming",     Icon: IconGroom    },
  { key: "veterinary", label: "Veterinary",   Icon: IconMedical  },
  { key: "training",   label: "Training",     Icon: IconTraining },
  { key: "sitting",    label: "Pet Sitting",  Icon: IconHome     },
];

export default function useServices() {
  const [activeCategory,   setActiveCategory]   = useState("all");
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange,       setPriceRange]       = useState(100000);
  const [location,         setLocation]         = useState("");
  const [inlineSearch,     setInlineSearch]     = useState("");
  const [mobileFiltersOpen,setMobileFiltersOpen]= useState(false);
  const [page,             setPage]             = useState(1);

  const [services,    setServices]    = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [hasMore,     setHasMore]     = useState(true);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (page === 1) setLoading(true); else setLoadingMore(true);

    const params = {
      page,
      limit:     12,
      category:  activeCategory !== "all" ? activeCategory : undefined,
      petTypes:  selectedPetTypes.length > 0 ? selectedPetTypes.join(",") : undefined,
      maxPrice:  priceRange < 100000 ? priceRange : undefined,
      search:    inlineSearch || undefined,
    };

    api.get(`/services${qs(params)}`)
      .then(data => {
        if (cancelled) return;
        const newItems = data.services ?? [];
        setServices(prev => page === 1 ? newItems : [...prev, ...newItems]);
        setTotalCount(data.total ?? data.totalCount ?? 0);
        setHasMore(page < (data.totalPages ?? 1));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) { setLoading(false); setLoadingMore(false); } });

    return () => { cancelled = true; };
  }, [page, activeCategory, selectedPetTypes, priceRange, inlineSearch]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) setPage(p => p + 1);
  }, [loading, loadingMore, hasMore]);

  const handleSetActiveCategory = useCallback((c) => { setActiveCategory(c); setPage(1); }, []);
  const handleSetInlineSearch   = useCallback((s) => { setInlineSearch(s);   setPage(1); }, []);
  const handlePetTypeChange     = useCallback((type) => {
    setSelectedPetTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setPage(1);
  }, []);
  const handleSetPriceRange = useCallback((r) => { setPriceRange(r); setPage(1); }, []);

  const handleReset = useCallback(() => {
    setSelectedPetTypes([]);
    setPriceRange(100000);
    setLocation("");
    setActiveCategory("all");
    setPage(1);
  }, []);

  return {
    CATEGORIES, services, totalCount, loading, loadingMore, hasMore,
    activeCategory, setActiveCategory: handleSetActiveCategory,
    inlineSearch, setInlineSearch: handleSetInlineSearch,
    selectedPetTypes, handlePetTypeChange,
    priceRange, setPriceRange: handleSetPriceRange,
    location, setLocation,
    mobileFiltersOpen, setMobileFiltersOpen,
    handleReset, loadMore,
  };
}
