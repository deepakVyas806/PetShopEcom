"use client";

import React, { useState, useRef, useEffect } from "react";
import useProductsList from "./ProductsListContainer.hook";
import { IconSearchOff, IconArrowRight } from "@/lib/icons";
import BreadcrumbsToolbar from "./Components/BreadcrumbsToolbar";
import SidebarFilters from "./Components/SidebarFilters";
import ProductCard from "./Components/ProductCard";
import MobileFilterDrawer from "./Components/MobileFilterDrawer";
import Link from "next/link";

export default function ProductsListContainer() {
  const {
    products,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    brands,
    petTypeOptions,
    categoryOptions,
    selectedPetTypes,
    handlePetTypeChange,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    selectedBrands,
    handleBrandChange,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    setSearchQuery,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    favorites,
    toggleFavorite,
    addedItems,
    handleAddToCart,
    loadMore,
  } = useProductsList();

  const [viewMode, setViewMode] = useState("grid");
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleClearAll = () => {
    selectedPetTypes.forEach((t) => handlePetTypeChange(t));
    selectedCategories.forEach((c) => handleCategoryChange(c));
    selectedBrands.forEach((b) => handleBrandChange(b));
    setPriceRange(5000);
    setRatingFilter(false);
  };

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">

        <BreadcrumbsToolbar
          totalCount={totalCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          onListSearch={setSearchQuery}
          selectedPetTypes={selectedPetTypes}
          onClearPetType={handlePetTypeChange}
          selectedCategories={selectedCategories}
          onClearCategory={handleCategoryChange}
          priceRange={priceRange}
          onClearPrice={() => setPriceRange(5000)}
          ratingFilter={ratingFilter}
          onClearRating={() => setRatingFilter(false)}
          selectedBrands={selectedBrands}
          onClearBrand={handleBrandChange}
          onClearAll={handleClearAll}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className="flex flex-col md:flex-row gap-4 md:gap-gutter">

          <SidebarFilters
            selectedPetTypes={selectedPetTypes}
            onPetTypeChange={handlePetTypeChange}
            petTypeOptions={petTypeOptions}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            categoryOptions={categoryOptions}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            brands={brands}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
            onReset={handleClearAll}
          />

          <section className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === "list" ? "flex flex-col gap-3" : "grid grid-cols-2 lg:grid-cols-3 gap-3"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`rounded-lg bg-surface-container-low animate-pulse ${viewMode === "list" ? "h-28" : "aspect-square"}`} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={
                  viewMode === "list"
                    ? "flex flex-col gap-3"
                    : "grid grid-cols-2 lg:grid-cols-3 gap-3"
                }>
                  {products.map((product, i) => (
                    <ProductCard
                      key={product._id ?? product.id ?? i}
                      product={product}
                      isFavorite={!!favorites[product._id ?? product.id]}
                      onToggleFavorite={toggleFavorite}
                      isAdded={!!addedItems[product._id ?? product.id]}
                      onAddToCart={handleAddToCart}
                      layout={viewMode}
                    />
                  ))}
                </div>

                <div ref={sentinelRef} className="h-1" />

                {loadingMore && (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <p className="text-center text-xs text-on-surface-variant py-6">
                    You&apos;ve seen all {totalCount.toLocaleString()} products
                  </p>
                )}
              </>
            ) : (
              <div className="w-full py-16 text-center bg-white dark:bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-sm">
                <IconSearchOff size={40} className="text-primary/30 mb-4 mx-auto" weight="duotone" />
                <h3 className="text-sm font-bold text-on-surface mb-2">No Products Found</h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed mb-4">
                  Try adjusting your filters or search a different keyword.
                </p>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-5 py-2 rounded-full hover:brightness-110 transition-all"
                >
                  Browse All Products <IconArrowRight size={13} weight="bold" />
                </Link>
              </div>
            )}
          </section>

        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        selectedPetTypes={selectedPetTypes}
        onPetTypeChange={handlePetTypeChange}
        petTypeOptions={petTypeOptions}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        categoryOptions={categoryOptions}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedBrands={selectedBrands}
        onBrandChange={handleBrandChange}
        brands={brands}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        onReset={handleClearAll}
      />
    </div>
  );
}
