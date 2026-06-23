"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconFilter, IconSearch, IconClose, IconGrid, IconList } from "@/lib/icons";

const SORT_OPTIONS = [
  { value: "Popularity",          label: "Most Popular"       },
  { value: "Newest Arrivals",     label: "Newest First"       },
  { value: "Price: Low to High",  label: "Price: Low → High"  },
  { value: "Price: High to Low",  label: "Price: High → Low"  },
  { value: "Rating",              label: "Avg Rating"         },
];

const CATEGORY_LABELS = {
  food:        "Food & Treats",
  toy:         "Toys & Play",
  health:      "Health & Pharma",
  grooming:    "Grooming",
  beds:        "Beds & Houses",
  accessories: "Accessories",
};

export default function BreadcrumbsToolbar({
  totalCount,
  sortBy,
  setSortBy,
  onOpenMobileFilters,
  onListSearch,
  /* filter chip props */
  selectedPetTypes    = [],
  onClearPetType,
  selectedCategories  = [],
  onClearCategory,
  priceRange,
  onClearPrice,
  ratingFilter,
  onClearRating,
  selectedBrands      = [],
  onClearBrand,
  onClearAll,
  /* view toggle */
  viewMode,
  setViewMode,
}) {
  const [localQuery, setLocalQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onListSearch?.(localQuery), 350);
    return () => clearTimeout(timer);
  }, [localQuery, onListSearch]);

  /* Build chip list */
  const chips = [
    ...selectedPetTypes.map((t) => ({
      label:    t.charAt(0).toUpperCase() + t.slice(1).replace("-", " "),
      onRemove: () => onClearPetType?.(t),
    })),
    ...selectedCategories.map((c) => ({
      label:    CATEGORY_LABELS[c] ?? c,
      onRemove: () => onClearCategory?.(c),
    })),
    ...(priceRange < 5000 ? [{
      label:    `Up to ₹${priceRange.toLocaleString()}`,
      onRemove: onClearPrice,
    }] : []),
    ...(ratingFilter ? [{
      label:    "4★ & above",
      onRemove: onClearRating,
    }] : []),
    ...selectedBrands.map((b) => ({
      label:    b,
      onRemove: () => onClearBrand?.(b),
    })),
  ];

  const mobileFilterCount = chips.length;

  return (
    <div className="mb-4 space-y-2.5">

      {/* Row 1: breadcrumb + count */}
      <div className="flex items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-primary transition-colors font-medium text-on-surface">
            Shop
          </Link>
          {selectedPetTypes.length === 1 && (
            <>
              <span>/</span>
              <span className="text-on-surface font-medium capitalize">{selectedPetTypes[0].replace("_", " ")}</span>
            </>
          )}
        </nav>
        <span className="text-xs text-on-surface-variant shrink-0">
          <span className="font-bold text-on-surface">{totalCount.toLocaleString()}</span> products
        </span>
      </div>

      {/* Row 2: search + sort + view toggle + mobile filter btn */}
      <div className="flex items-center gap-2">
        {/* Inline search */}
        <div className="flex-1 flex items-center bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant/40 focus-within:border-primary transition-colors gap-2 h-9">
          <IconSearch size={14} className="text-on-surface-variant shrink-0" weight="regular" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search within results…"
            className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none text-on-surface placeholder:text-on-surface-variant/50 min-w-0"
          />
          {localQuery && (
            <button onClick={() => setLocalQuery("")} className="bg-transparent border-none cursor-pointer shrink-0 text-on-surface-variant hover:text-on-surface">
              <IconClose size={12} weight="bold" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="hidden sm:block bg-white dark:bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2.5 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer font-medium h-9 shrink-0"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* View toggle — desktop */}
        {setViewMode && (
          <div className="hidden md:flex items-center border border-outline-variant/40 rounded-lg overflow-hidden h-9 shrink-0">
            {["grid", "list"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 h-full flex items-center justify-center transition-colors cursor-pointer border-none ${
                  viewMode === mode
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-surface text-on-surface-variant hover:bg-surface-container"
                }`}
                title={`${mode} view`}
              >
                {mode === "grid"
                  ? <IconGrid size={14} weight="bold" />
                  : <IconList size={14} weight="bold" />
                }
              </button>
            ))}
          </div>
        )}

        {/* Mobile filter + sort */}
        <button
          onClick={onOpenMobileFilters}
          className="md:hidden flex items-center gap-1.5 px-3 h-9 border border-outline-variant/40 rounded-lg bg-white dark:bg-surface text-xs font-medium text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <IconFilter size={13} weight="regular" />
          Filters
          {mobileFilterCount > 0 && (
            <span className="bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {mobileFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Row 3: active filter chips */}
      {chips.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-on-surface-variant font-medium shrink-0">Active:</span>
          {chips.map(({ label, onRemove }) => (
            <button
              key={label}
              onClick={onRemove}
              className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20 outline-none"
            >
              {label}
              <IconClose size={9} weight="bold" />
            </button>
          ))}
          {chips.length > 1 && (
            <button
              onClick={onClearAll}
              className="text-[10px] text-on-surface-variant hover:text-red-500 cursor-pointer border-none bg-transparent font-semibold underline outline-none ml-1"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
