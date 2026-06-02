"use client";

import React from "react";

export default function SidebarFilters({
  selectedPetTypes,
  onPetTypeChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  ratingFilter,
  onRatingFilterChange
}) {
  return (
    <aside className="hidden md:block w-64 shrink-0 text-left select-none">
      <div className="sticky top-24 flex flex-col gap-6">
        
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
              <span className="text-xs group-hover:text-primary transition-colors">Dogs</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
              <input 
                type="checkbox" 
                checked={selectedPetTypes.includes("cats")}
                onChange={() => onPetTypeChange("cats")}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
              />
              <span className="text-xs group-hover:text-primary transition-colors">Cats</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group text-on-surface">
              <input 
                type="checkbox" 
                checked={selectedPetTypes.includes("small_pets")}
                onChange={() => onPetTypeChange("small_pets")}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary" 
              />
              <span className="text-xs group-hover:text-primary transition-colors">Small Pets</span>
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
                <span className="text-xs group-hover:text-primary transition-colors">{brand}</span>
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
    </aside>
  );
}
