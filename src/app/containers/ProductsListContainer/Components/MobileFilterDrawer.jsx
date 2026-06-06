"use client";

import { useEffect } from "react";
import FilterPanel from "@/components/common/FilterPanel";
import { IconClose } from "@/lib/icons";

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedPetTypes,
  onPetTypeChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  ratingFilter,
  onRatingFilterChange,
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end select-none">
      <div onClick={onClose} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300" />

      <div className="relative w-80 max-w-[85vw] h-full bg-surface shadow-2xl flex flex-col z-10 text-left">
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <h2 className="text-sm font-bold text-on-surface">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/5 cursor-pointer border-none outline-none flex items-center justify-center"
            aria-label="Close filters"
          >
            <IconClose size={16} weight="regular" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc3d8 transparent" }}>
          <FilterPanel
            showPetType
            showPriceRange
            showBrands
            showRating
            selectedPetTypes={selectedPetTypes}
            onPetTypeChange={onPetTypeChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            selectedBrands={selectedBrands}
            onBrandChange={onBrandChange}
            ratingFilter={ratingFilter}
            onRatingFilterChange={onRatingFilterChange}
          />
        </div>

        <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none outline-none"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
