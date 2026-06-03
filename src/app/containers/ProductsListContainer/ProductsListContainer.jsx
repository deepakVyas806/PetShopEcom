"use client";

import React from "react";
import useProductsList from "./ProductsListContainer.hook";
import BreadcrumbsToolbar from "./Components/BreadcrumbsToolbar";
import SidebarFilters from "./Components/SidebarFilters";
import ProductCard from "./Components/ProductCard";
import MobileFilterDrawer from "./Components/MobileFilterDrawer";

export default function ProductsListContainer() {
  const {
    products,
    totalCount,
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
    currentPage,
    setCurrentPage,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    favorites,
    toggleFavorite,
    addedItems,
    handleAddToCart
  } = useProductsList();

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      {/* Content Container */}
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">

        {/* Breadcrumbs & Title Toolbar — above sidebar+grid split */}
        <BreadcrumbsToolbar
          totalCount={totalCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        />

        {/* Core Layout Split */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-gutter">

          {/* Desktop Filter Sidebar */}
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

          {/* Product Grid Area */}
          <section className="flex-1">
            {totalCount > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      isFavorite={!!favorites[product.id]}
                      onToggleFavorite={toggleFavorite}
                      isAdded={!!addedItems[product.id]}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-1.5 select-none text-xs">
                  <button 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold shadow-sm">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary/5 transition-colors cursor-pointer text-on-surface">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary/5 transition-colors cursor-pointer text-on-surface">
                    3
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant font-medium">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary/5 transition-colors cursor-pointer text-on-surface">
                    12
                  </button>
                  
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary/5 transition-colors cursor-pointer text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full py-16 text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-inner">
                <span className="material-symbols-outlined text-primary text-4xl mb-3">search_off</span>
                <h3 className="text-xs uppercase tracking-wider font-bold text-on-surface mb-1.5">No Products Found</h3>
                <p className="text-[11px] text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                  We couldn't find any products matching your active filters. Try adjusting your search query, price limit, or selecting different categories.
                </p>
              </div>
            )}
          </section>

        </div>

      </div>

      {/* Mobile Filters Slide-over Drawer */}
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
