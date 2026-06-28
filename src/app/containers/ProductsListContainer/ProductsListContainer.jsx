"use client";

import React, { useState, useEffect, useRef } from "react";
import useProductsList from "./ProductsListContainer.hook";
import { IconSearchOff, IconArrowRight } from "@/lib/icons";
import BreadcrumbsToolbar from "./Components/BreadcrumbsToolbar";
import SidebarFilters from "./Components/SidebarFilters";
import ProductCard from "./Components/ProductCard";
import MobileFilterDrawer from "./Components/MobileFilterDrawer";
import PageHeader from "@/components/common/PageHeader";
import Link from "next/link";

const INNER = "max-w-container-max mx-auto px-4 md:px-margin-desktop";


export default function ProductsListContainer() {
  const {
    products, totalCount, loading, loadingMore, hasMore,
    brands, petTypeOptions, categoryOptions,
    selectedPetTypes, handlePetTypeChange,
    selectedCategories, handleCategoryChange,
    priceRange, setPriceRange,
    selectedBrands, handleBrandChange,
    ratingFilter, setRatingFilter,
    sortBy, setSortBy, setSearchQuery,
    mobileFiltersOpen, setMobileFiltersOpen,
    favorites, toggleFavorite,
    addedItems, handleAddToCart,
    loadMore,
  } = useProductsList();

  const [viewMode, setViewMode] = useState("grid");

  // ── Sticky toolbar ──────────────────────────────────────────────────────────
  const sentinelRef     = useRef(null);  // zero-height marker at toolbar's natural position
  const toolbarRef      = useRef(null);  // toolbar element (to measure its height)
  const [stuck,         setStuck]         = useState(false);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [headerHeight,  setHeaderHeight]  = useState(0);

  // Measure the real rendered header height (handles all screen sizes + banner state)
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(header.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Scroll listener: stick when sentinel reaches the bottom of the header
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const onScroll = () => {
      const rect = sentinel.getBoundingClientRect();
      setStuck(rect.top <= headerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerHeight]);

  // Measure toolbar height so the placeholder keeps layout stable
  useEffect(() => {
    if (toolbarRef.current) {
      setToolbarHeight(toolbarRef.current.offsetHeight);
    }
  });
  // ───────────────────────────────────────────────────────────────────────────

  const handleClearAll = () => {
    selectedPetTypes.forEach((t) => handlePetTypeChange(t));
    selectedCategories.forEach((c) => handleCategoryChange(c));
    selectedBrands.forEach((b) => handleBrandChange(b));
    setPriceRange(5000);
    setRatingFilter(false);
  };

  const gridCls = viewMode === "list"
    ? "flex flex-col gap-3"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-5";

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/marketplace" },
    ...(selectedPetTypes.length === 1
      ? [{ label: selectedPetTypes[0].replace(/_/g, " ") }]
      : [{ label: "All Products" }]
    ),
  ];

  const toolbarContent = (
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
  );

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">

      {/* Page title + breadcrumbs — scrolls away */}
      <div className={`${INNER} pt-4 pb-2`}>
        <PageHeader
          breadcrumbs={crumbs}
          title={selectedPetTypes.length === 1
            ? selectedPetTypes[0].replace(/_/g, " ") + " Products"
            : "Shop All Products"
          }
          subtitle={totalCount > 0 ? `${totalCount.toLocaleString()} products available` : undefined}
        />
      </div>

      {/* Sentinel — zero-height marker at the toolbar's natural position */}
      <div ref={sentinelRef} className="h-0" />

      {/* When stuck, placeholder holds the space so content doesn't jump */}
      {stuck && <div style={{ height: toolbarHeight }} />}

      {/* Toolbar — fixed when stuck, inline otherwise */}
      <div
        ref={toolbarRef}
        style={stuck ? { top: headerHeight } : undefined}
        className={[
          "z-20 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/25",
          "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
          stuck ? "fixed left-0 right-0" : "relative",
        ].join(" ")}
      >
        <div className={`${INNER} py-2`}>
          {toolbarContent}
        </div>
      </div>

      {/* Main content */}
      <div className={`${INNER} pt-4 pb-8`}>
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
              <div className={gridCls}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`rounded-xl animate-shimmer ${viewMode === "list" ? "h-28" : "aspect-square"}`} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={gridCls}>
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

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer shadow-brand-sm"
                    >
                      {loadingMore ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading…
                        </>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <p className="text-center text-xs text-on-surface-variant py-6">
                    You&apos;ve seen all {totalCount.toLocaleString()} products
                  </p>
                )}
              </>
            ) : (
              <div className="w-full py-16 text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-card-sm">
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
