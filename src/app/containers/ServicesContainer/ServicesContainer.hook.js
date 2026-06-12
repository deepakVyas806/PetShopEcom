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
  const [currentPage,      setCurrentPage]      = useState(1);

  const [services,    setServices]    = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page:      currentPage,
        limit:     12,
        category:  activeCategory !== "all" ? activeCategory : undefined,
        petTypes:  selectedPetTypes.length > 0 ? selectedPetTypes.join(",") : undefined,
        maxPrice:  priceRange < 100000 ? priceRange : undefined,
        search:    inlineSearch || undefined,
      };
      const data = await api.get(`/services${qs(params)}`);
      setServices(data.services ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeCategory, selectedPetTypes, priceRange, inlineSearch]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handlePetTypeChange = (type) =>
    setSelectedPetTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const handleReset = () => {
    setSelectedPetTypes([]); setPriceRange(100000); setLocation(""); setActiveCategory("all"); setCurrentPage(1);
  };

  return {
    CATEGORIES, services, totalCount, totalPages, loading,
    activeCategory, setActiveCategory: (c) => { setActiveCategory(c); setCurrentPage(1); },
    inlineSearch, setInlineSearch: (s) => { setInlineSearch(s); setCurrentPage(1); },
    selectedPetTypes, handlePetTypeChange,
    priceRange, setPriceRange,
    location, setLocation,
    mobileFiltersOpen, setMobileFiltersOpen,
    handleReset, currentPage, setCurrentPage,
  };
}
