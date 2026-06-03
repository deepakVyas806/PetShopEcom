"use client";

import Link from "next/link";

export default function BreadcrumbsToolbar({ totalCount, sortBy, setSortBy, onOpenMobileFilters }) {
  return (
    <div className="flex flex-col gap-3 mb-4 text-left">

      {/* Breadcrumbs */}
      <nav className="flex text-xs text-on-surface-variant items-center gap-1.5 select-none">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <Link href="/marketplace" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Pet Food</span>
      </nav>

      {/* Title + toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-sm font-bold text-on-surface tracking-tight">Premium Pet Food</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {totalCount > 0 ? `${totalCount} results` : "No results found"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-on-surface-variant font-medium hidden sm:block">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer font-medium"
            >
              <option value="Popularity">Popularity</option>
              <option value="Newest Arrivals">Newest</option>
              <option value="Price: Low to High">Price ↑</option>
              <option value="Price: High to Low">Price ↓</option>
              <option value="Rating">Rating</option>
            </select>
          </div>

          {/* Mobile filter trigger */}
          <button
            onClick={onOpenMobileFilters}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-lg bg-surface text-xs font-medium text-on-surface hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
