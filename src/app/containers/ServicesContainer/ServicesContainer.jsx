"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IconFilter, IconSearch, IconClose, IconSearchOff } from "@/lib/icons";
import useServices from "./ServicesContainer.hook";
import FilterPanel from "@/components/common/FilterPanel";
import ServiceCard from "./Components/ServiceCard";
import ServicesCategoryFilter from "./Components/ServicesCategoryFilter";
import PageHeader from "@/components/common/PageHeader";

const PROMO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpwTBDGSHMOEiqQdIAlHeRB0OBgO9vM9pwKvzIcRfGqYRV8OiNroaZHPoBk64R3pNRpPv0S04r-9hZlUEiO91tWnLBCw_0p9NYRwDyTBJiu62f5BAb2vRETDUwob99oda-sXu6AOtp-G2pAZLTB6Fq-eR1XbznbULnMTJygDxLjHHMAu636-4ySBc-smeTHEiq9d0HBtfa3tZXS7SSTbCZF0gpJihhEuyqi-SvQr3-C7oEwxHovxLc5DW8YQ05Ju1AozTI5zkoeNWI";

export default function ServicesContainer() {
  const {
    CATEGORIES,
    services,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    activeCategory,
    setActiveCategory,
    selectedPetTypes,
    handlePetTypeChange,
    priceRange,
    setPriceRange,
    location,
    setLocation,
    inlineSearch,
    setInlineSearch,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    handleReset,
    loadMore,
  } = useServices();

  const [localQuery, setLocalQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setInlineSearch(localQuery), 350);
    return () => clearTimeout(t);
  }, [localQuery, setInlineSearch]);

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

        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: activeCategory === "all" ? "All Services" : activeCategory },
          ]}
          title="Professional Pet Care"
          subtitle={totalCount > 0 ? `${totalCount} services available` : "No services found"}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-on-surface-variant font-medium hidden sm:block">Sort:</span>
            <select className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer font-medium">
              <option>Popularity</option>
              <option>Price ↑</option>
              <option>Price ↓</option>
              <option>Rating</option>
            </select>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-lg bg-surface text-xs font-medium text-on-surface hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
          >
            <IconFilter size={15} className="leading-none" weight="regular" />
            Filter
          </button>
        </PageHeader>

        <div className="mt-3 mb-4 flex items-center bg-surface-container-low rounded-full px-3 py-2 border border-outline-variant/50 focus-within:border-primary transition-colors gap-2">
          <IconSearch size={16} className="text-on-surface-variant flex-shrink-0" weight="regular" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Filter services by name…"
            className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none text-on-surface placeholder:text-on-surface-variant/50 min-w-0"
          />
          {localQuery && (
            <button type="button" onClick={() => setLocalQuery("")}
              className="bg-transparent border-none cursor-pointer flex-shrink-0 text-on-surface-variant hover:text-on-surface">
              <IconClose size={13} weight="bold" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-gutter">

          <aside className="hidden md:flex flex-col w-52 shrink-0 h-fit sticky top-24 gap-4">
            <FilterPanel
              showPetType
              showPriceRange
              showLocation
              priceMin={20}
              priceMax={500}
              selectedPetTypes={selectedPetTypes}
              onPetTypeChange={handlePetTypeChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              location={location}
              onLocationChange={setLocation}
              onReset={handleReset}
            />

            <div className="relative rounded-xl overflow-hidden shadow-md group" style={{ aspectRatio: "4/3" }}>
              <img
                src={PROMO_IMAGE}
                alt="First grooming promo"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-xs">First Grooming?</span>
                <p className="text-white/90 text-xs mb-2">20% off your first appointment.</p>
                <button className="bg-white text-primary px-3 py-1 rounded-lg font-bold text-xs self-start shadow-lg cursor-pointer border-none outline-none">
                  Claim Offer
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1 min-w-0">

            <ServicesCategoryFilter
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-surface-container-low animate-pulse h-64" />
                ))}
              </div>
            ) : services.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service._id ?? service.id} service={service} />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />

                {loadingMore && (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!hasMore && services.length > 0 && (
                  <p className="text-center text-xs text-on-surface-variant py-6">
                    All {totalCount} services loaded
                  </p>
                )}
              </>
            ) : (
              <div className="w-full py-16 text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-inner">
                <IconSearchOff size={36} className="text-primary mb-3" weight="duotone" />
                <h3 className="text-xs uppercase tracking-wider font-bold text-on-surface mb-1.5">
                  No Services Found
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                  Try adjusting your filters or selecting a different category.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end select-none">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-surface shadow-2xl flex flex-col z-10 text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
              <h2 className="text-sm font-bold text-on-surface">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-primary cursor-pointer border-none outline-none"
              >
                <IconClose size={18} weight="regular" />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc3d8 transparent" }}
            >
              <FilterPanel
                showPetType
                showPriceRange
                showLocation
                priceMin={20}
                priceMax={500}
                selectedPetTypes={selectedPetTypes}
                onPetTypeChange={handlePetTypeChange}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                location={location}
                onLocationChange={setLocation}
                onReset={handleReset}
              />
            </div>
            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs shadow-md cursor-pointer border-none outline-none"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
