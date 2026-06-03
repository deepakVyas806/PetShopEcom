"use client";

import FilterPanel from "@/components/common/FilterPanel";

export default function SidebarFilters({
  selectedPetTypes,
  onPetTypeChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  ratingFilter,
  onRatingFilterChange,
}) {
  return (
    <aside className="hidden md:block w-52 shrink-0 text-left select-none">
      <div className="sticky top-24">
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
    </aside>
  );
}
