"use client";

import Link from "next/link";
import useServices from "./ServicesContainer.hook";
import FilterPanel from "@/components/common/FilterPanel";
import ServiceCard from "./Components/ServiceCard";
import ServicesCategoryFilter from "./Components/ServicesCategoryFilter";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";

const PROMO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpwTBDGSHMOEiqQdIAlHeRB0OBgO9vM9pwKvzIcRfGqYRV8OiNroaZHPoBk64R3pNRpPv0S04r-9hZlUEiO91tWnLBCw_0p9NYRwDyTBJiu62f5BAb2vRETDUwob99oda-sXu6AOtp-G2pAZLTB6Fq-eR1XbznbULnMTJygDxLjHHMAu636-4ySBc-smeTHEiq9d0HBtfa3tZXS7SSTbCZF0gpJihhEuyqi-SvQr3-C7oEwxHovxLc5DW8YQ05Ju1AozTI5zkoeNWI";

export default function ServicesContainer() {
  const {
    CATEGORIES,
    services,
    totalCount,
    activeCategory,
    setActiveCategory,
    selectedPetTypes,
    handlePetTypeChange,
    priceRange,
    setPriceRange,
    location,
    setLocation,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    handleReset,
    currentPage,
    setCurrentPage,
  } = useServices();

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">

        {/* Page Header */}
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
            <span className="material-symbols-outlined leading-none" style={{ fontSize: 15 }}>filter_list</span>
            Filter
          </button>
        </PageHeader>

        {/* Layout Split */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-gutter">

        {/* Desktop Sidebar */}
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

          {/* Promo Card */}
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

        {/* Main Content */}
        <section className="flex-1 min-w-0">

          {/* Category Pills */}
          <ServicesCategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Service Grid */}
          {services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex flex-col items-center gap-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={8}
                  onPageChange={setCurrentPage}
                />
                <p className="text-xs text-on-surface-variant">
                  Showing {totalCount} of 32 premium services
                </p>
              </div>
            </>
          ) : (
            <div className="w-full py-16 text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-inner">
              <span className="material-symbols-outlined text-primary text-4xl mb-3">search_off</span>
              <h3 className="text-xs uppercase tracking-wider font-bold text-on-surface mb-1.5">
                No Services Found
              </h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                Try adjusting your filters or selecting a different category.
              </p>
            </div>
          )}
        </section>
        </div> {/* layout split */}
      </div> {/* outer container */}

      {/* Mobile Filter Drawer */}
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
                <span className="material-symbols-outlined text-base">close</span>
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
