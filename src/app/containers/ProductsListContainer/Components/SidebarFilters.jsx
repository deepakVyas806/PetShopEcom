"use client";

import FilterPanel from "@/components/common/FilterPanel";

export default function SidebarFilters({
  selectedPetTypes,
  onPetTypeChange,
  petTypeOptions,
  selectedCategories,
  onCategoryChange,
  categoryOptions,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  brands,
  ratingFilter,
  onRatingFilterChange,
  onReset,
}) {
  return (
    <aside className="hidden md:block w-52 shrink-0 text-left select-none">
      <div className="sticky top-24">
        <FilterPanel
          showPetType
          showCategory
          showPriceRange
          showBrands
          showRating
          selectedPetTypes={selectedPetTypes}
          onPetTypeChange={onPetTypeChange}
          petTypeOptions={petTypeOptions}
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoryChange}
          categoryOptions={categoryOptions}
          priceRange={priceRange}
          onPriceRangeChange={onPriceRangeChange}
          selectedBrands={selectedBrands}
          onBrandChange={onBrandChange}
          brands={brands}
          ratingFilter={ratingFilter}
          onRatingFilterChange={onRatingFilterChange}
          onReset={onReset}
        />
      </div>
    </aside>
  );
}
