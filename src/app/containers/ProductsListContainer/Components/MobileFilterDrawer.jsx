"use client";

import React, { useEffect } from "react";

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedPetTypes,
  onPetTypeChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  ratingFilter,
  onRatingFilterChange
}) {
  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[85vw] h-full bg-surface shadow-2xl flex flex-col z-10 transition-transform duration-300 animate-slide-left text-left">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <h2 className="text-sm font-bold text-on-surface">Filters</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/5 cursor-pointer active:scale-90 transition-all border-none outline-none flex items-center justify-center"
            aria-label="Close filters"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Filters Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          
          {/* Pet Type */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold mb-3 text-on-surface">Pet Type</h3>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
                <input 
                  type="checkbox" 
                  checked={selectedPetTypes.includes("dogs")}
                  onChange={() => onPetTypeChange("dogs")}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
                <span className="text-xs">Dogs</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
                <input 
                  type="checkbox" 
                  checked={selectedPetTypes.includes("cats")}
                  onChange={() => onPetTypeChange("cats")}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
                <span className="text-xs">Cats</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
                <input 
                  type="checkbox" 
                  checked={selectedPetTypes.includes("small_pets")}
                  onChange={() => onPetTypeChange("small_pets")}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
                <span className="text-xs">Small Pets</span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold mb-3 text-on-surface">Price</h3>
            <div className="px-1">
              <input 
                type="range"
                min="0"
                max="200"
                step="10"
                value={priceRange}
                onChange={(e) => onPriceRangeChange(Number(e.target.value))}
                className="w-full h-1 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div className="flex justify-between mt-2 text-xs text-on-surface-variant font-medium">
                <span>$0</span>
                <span>${priceRange}+</span>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold mb-3 text-on-surface">Popular Brands</h3>
            <div className="flex flex-col gap-2.5">
              {[
                "Royal Canin",
                "Purina Pro",
                "Hill's Science Diet",
                "Blue Buffalo"
              ].map((brand) => (
                <label key={brand} className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandChange(brand)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
                  />
                  <span className="text-xs">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold mb-3 text-on-surface">Customer Rating</h3>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
                <input 
                  type="checkbox" 
                  checked={ratingFilter}
                  onChange={() => onRatingFilterChange(!ratingFilter)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
                <div className="flex text-yellow-500">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[10px]">star</span>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">& Up</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none outline-none text-center"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
}
