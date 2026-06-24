"use client";

import { IconFilter, IconStar } from "@/lib/icons";

const FALLBACK_PET_TYPES = [
  { key: "dogs",       label: "Dogs"       },
  { key: "cats",       label: "Cats"       },
  { key: "birds",      label: "Birds"      },
  { key: "fish",       label: "Fish"       },
  { key: "small-pets", label: "Small Pets" },
];

const FALLBACK_CATEGORIES = [
  { key: "food",        label: "Food & Treats"   },
  { key: "toy",         label: "Toys & Play"     },
  { key: "health",      label: "Health & Pharma" },
  { key: "grooming",    label: "Grooming"        },
  { key: "beds",        label: "Beds & Houses"   },
  { key: "accessories", label: "Accessories"     },
];

const DEFAULT_BRANDS = [
  { key: "royal-canin", label: "Royal Canin" },
  { key: "pedigree",    label: "Pedigree"    },
  { key: "purina",      label: "Purina"      },
  { key: "whiskas",     label: "Whiskas"     },
  { key: "himalaya",    label: "Himalaya"    },
  { key: "drools",      label: "Drools"      },
  { key: "trixie",      label: "Trixie"      },
  { key: "beaphar",     label: "Beaphar"     },
];

const Divider = () => <div className="h-px bg-outline-variant/20" />;

function SectionLabel({ children }) {
  return (
    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
      {children}
    </span>
  );
}

export default function FilterPanel({
  showPetType      = true,
  showCategory     = true,
  showPriceRange   = true,
  showBrands       = false,
  showRating       = false,

  selectedPetTypes = [],
  onPetTypeChange,
  // API-driven pet type options — falls back to hardcoded list
  petTypeOptions,

  selectedCategories = [],
  onCategoryChange,
  // API-driven category options — falls back to hardcoded list
  categoryOptions,

  priceRange = 250,
  onPriceRangeChange,
  priceMin   = 0,
  priceMax   = 5000,

  selectedBrands = [],
  onBrandChange,
  brands         = DEFAULT_BRANDS,

  ratingFilter = false,
  onRatingFilterChange,

  onReset,
}) {
  const PET_TYPES         = petTypeOptions?.length   ? petTypeOptions   : FALLBACK_PET_TYPES;
  const PRODUCT_CATEGORIES = categoryOptions?.length ? categoryOptions  : FALLBACK_CATEGORIES;
  const activeCount =
    selectedPetTypes.length +
    selectedCategories.length +
    selectedBrands.length +
    (ratingFilter ? 1 : 0) +
    (priceRange < priceMax ? 1 : 0);

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
      {showPetType && (
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
          <Divider />
        </>
      )}

      {/* Category */}
      {showCategory && (
        <>
          <div>
            <SectionLabel>Category</SectionLabel>
            <div className="flex flex-col gap-2">
              {PRODUCT_CATEGORIES.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(key)}
                    onChange={() => onCategoryChange?.(key)}
                    className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span className={`text-xs transition-colors ${selectedCategories.includes(key) ? "text-primary font-semibold" : "text-on-surface group-hover:text-primary"}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* Price Range */}
      {showPriceRange && (
        <>
          <div>
            <SectionLabel>Price Range</SectionLabel>
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step="100"
              value={priceRange}
              onChange={(e) => onPriceRangeChange?.(Number(e.target.value))}
              className="w-full h-1 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-1.5 text-xs text-on-surface-variant font-medium">
              <span>₹{priceMin}</span>
              <span className="font-bold text-primary">
                {priceRange >= priceMax ? `₹${priceMax.toLocaleString()}+` : `Up to ₹${priceRange.toLocaleString()}`}
              </span>
            </div>
          </div>
          {(showBrands || showRating) && <Divider />}
        </>
      )}

      {/* Brands */}
      {showBrands && (
        <>
          <div>
            <SectionLabel>Brand</SectionLabel>
            <div className="flex flex-col gap-2">
              {(brands.length > 0 ? brands : DEFAULT_BRANDS).map((brand) => {
                const key   = brand.key   ?? brand;
                const label = brand.label ?? brand;
                return (
                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(key)}
                      onChange={() => onBrandChange?.(key)}
                      className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <span className={`text-xs transition-colors ${selectedBrands.includes(key) ? "text-primary font-semibold" : "text-on-surface group-hover:text-primary"}`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          {showRating && <Divider />}
        </>
      )}

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
      {onReset && activeCount > 0 && (
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
