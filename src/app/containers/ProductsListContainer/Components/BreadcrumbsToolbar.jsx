"use client";

import React from "react";
import Link from "next/link";

export default function BreadcrumbsToolbar({ 
  totalCount, 
  sortBy, 
  setSortBy, 
  onOpenMobileFilters 
}) {
  return (
    <div className="flex flex-col gap-4 mb-8 text-left">
      {/* Breadcrumbs */}
      <nav className="flex text-xs text-on-surface-variant items-center gap-1.5 select-none">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <Link href="/marketplace" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Pet Food</span>
      </nav>

      {/* Title & Toolbar Actions */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">Premium Pet Food</h1>
          <p className="text-xs text-on-surface-variant">
            {totalCount > 0 
              ? `Showing 1–${totalCount} of ${totalCount} results`
              : "No results found"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer font-medium"
            >
              <option value="Popularity">Popularity</option>
              <option value="Newest Arrivals">Newest Arrivals</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Rating</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button 
            onClick={onOpenMobileFilters}
            className="md:hidden p-2 border border-outline-variant rounded-lg bg-surface hover:bg-primary/5 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-on-surface"
            aria-label="Filter items"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>
    </div>
  );
}
