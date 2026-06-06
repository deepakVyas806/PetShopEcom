"use client";

import { IconFilter, IconLocation, IconStar } from "@/lib/icons";

const PET_TYPES = [
  { key: "dogs",       label: "Dogs"       },
  { key: "cats",       label: "Cats"       },
  { key: "small_pets", label: "Small Pets" },
];

const DEFAULT_BRANDS = ["Royal Canin", "Purina Pro", "Hill's Science Diet", "Blue Buffalo"];

const Divider = () => <div className="h-px bg-outline-variant/20" />;

function SectionLabel({ children }) {
  return (
    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
      {children}
    </span>
  );
}

export default function FilterPanel({
  showPetType = true,
  showPriceRange = true,
  showBrands = false,
  showRating = false,
  showLocation = false,

  selectedPetTypes = [],
  onPetTypeChange,

  priceRange = 250,
  onPriceRangeChange,
  priceMin = 0,
  priceMax = 500,

  selectedBrands = [],
  onBrandChange,
  brands = DEFAULT_BRANDS,

  ratingFilter = false,
  onRatingFilterChange,

  location = "",
  onLocationChange,

  onReset,
}) {
  // Count active filters for badge
  const activeCount =
    selectedPetTypes.length +
    selectedBrands.length +
    (ratingFilter ? 1 : 0) +
    (location ? 1 : 0);

  const sections = [showPetType, showPriceRange, showLocation, showBrands, showRating].filter(Boolean).length;
  const needsDividerAfter = (index) => index < sections - 1;
  let sectionIndex = 0;

  return (
    <div className="bg-white/80 dark:bg-surface-container-lowest backdrop-blur-sm border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl shadow-sm p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
          <IconFilter size={15} className="text-primary" weight="regular" />
          Filters
        </h3>
        {activeCount > 0 && (
          <span className="bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </div>

      {/* Pet Type */}
      {showPetType && (() => {
        const idx = sectionIndex++;
        return (
          <>
            <div>
              <SectionLabel>Pet Type</SectionLabel>
              <div className="flex flex-col gap-2">
                {PET_TYPES.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPetTypes.includes(key)}
                      onChange={() => onPetTypeChange?.(key)}
                      className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <span className={`text-xs transition-colors ${selectedPetTypes.includes(key) ? "text-primary font-semibold" : "text-on-surface group-hover:text-primary"}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {needsDividerAfter(idx) && <Divider />}
          </>
        );
      })()}

      {/* Price Range */}
      {showPriceRange && (() => {
        const idx = sectionIndex++;
        return (
          <>
            <div>
              <SectionLabel>Price Range</SectionLabel>
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                step="10"
                value={priceRange}
                onChange={(e) => onPriceRangeChange?.(Number(e.target.value))}
                className="w-full h-1 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-1.5 text-xs text-on-surface-variant font-medium">
                <span>${priceMin}</span>
                <span className="font-bold text-primary">${priceRange}+</span>
              </div>
            </div>
            {needsDividerAfter(idx) && <Divider />}
          </>
        );
      })()}

      {/* Location */}
      {showLocation && (() => {
        const idx = sectionIndex++;
        return (
          <>
            <div>
              <SectionLabel>Location</SectionLabel>
              <div className="relative">
                <IconLocation size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" weight="regular" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => onLocationChange?.(e.target.value)}
                  placeholder="City or zip code"
                  className="w-full pl-7 pr-3 py-1.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface"
                />
              </div>
            </div>
            {needsDividerAfter(idx) && <Divider />}
          </>
        );
      })()}

      {/* Brands */}
      {showBrands && (() => {
        const idx = sectionIndex++;
        return (
          <>
            <div>
              <SectionLabel>Brands</SectionLabel>
              <div className="flex flex-col gap-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onBrandChange?.(brand)}
                      className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <span className={`text-xs transition-colors ${selectedBrands.includes(brand) ? "text-primary font-semibold" : "text-on-surface group-hover:text-primary"}`}>
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {needsDividerAfter(idx) && <Divider />}
          </>
        );
      })()}

      {/* Rating */}
      {showRating && (
        <div>
          <SectionLabel>Rating</SectionLabel>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={ratingFilter}
              onChange={() => onRatingFilterChange?.(!ratingFilter)}
              className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <div className="flex text-yellow-400">
              {[...Array(4)].map((_, i) => (
                <IconStar key={i} size={11} className="leading-none" weight="fill" />
              ))}
              <IconStar size={11} className="leading-none" weight="regular" />
            </div>
            <span className="text-xs text-on-surface-variant">& Up</span>
          </label>
        </div>
      )}

      {/* Reset */}
      {onReset && (
        <button
          onClick={onReset}
          className="w-full py-1.5 bg-surface-container-high text-on-surface-variant font-semibold text-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all cursor-pointer border-none outline-none mt-0.5"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
