"use client";

import React, { useRef, useEffect } from "react";
import useProductsList from "./ProductsListContainer.hook";
import { IconSearchOff } from "@/lib/icons";
import BreadcrumbsToolbar from "./Components/BreadcrumbsToolbar";
import SidebarFilters from "./Components/SidebarFilters";
import ProductCard from "./Components/ProductCard";
import MobileFilterDrawer from "./Components/MobileFilterDrawer";

export default function ProductsListContainer() {
  const {
    products,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    selectedPetTypes,
    handlePetTypeChange,
    priceRange,
    setPriceRange,
    selectedBrands,
    handleBrandChange,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    favorites,
    toggleFavorite,
    addedItems,
    handleAddToCart,
    loadMore,
  } = useProductsList();

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

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">

        <BreadcrumbsToolbar
          totalCount={totalCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          onListSearch={setSearchQuery}
        />

        <div className="flex flex-col md:flex-row gap-4 md:gap-gutter">

          <SidebarFilters
            selectedPetTypes={selectedPetTypes}
            onPetTypeChange={handlePetTypeChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
          />

          <section className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-surface-container-low animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((product, i) => (
                    <ProductCard
                      key={product._id ?? product.id ?? i}
                      product={product}
                      isFavorite={!!favorites[product._id ?? product.id]}
                      onToggleFavorite={toggleFavorite}
                      isAdded={!!addedItems[product._id ?? product.id]}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />

                {loadingMore && (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <p className="text-center text-xs text-on-surface-variant py-6">
                    All {totalCount} products loaded
                  </p>
                )}
              </>
            ) : (
              <div className="w-full py-16 text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-inner">
                <IconSearchOff size={36} className="text-primary mb-3" weight="duotone" />
                <h3 className="text-xs uppercase tracking-wider font-bold text-on-surface mb-1.5">No Products Found</h3>
                <p className="text-[11px] text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                  We couldn&apos;t find any products matching your active filters. Try adjusting your search query, price limit, or selecting different categories.
                </p>
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
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedBrands={selectedBrands}
        onBrandChange={handleBrandChange}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
      />
    </div>
  );
}
