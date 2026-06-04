"use client";

import PageHeader from "@/components/common/PageHeader";

export default function BreadcrumbsToolbar({ totalCount, sortBy, setSortBy, onOpenMobileFilters }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",  href: "/"            },
        { label: "Shop",  href: "/marketplace" },
        { label: "Pet Food"                    },
      ]}
      title="Premium Pet Food"
      subtitle={totalCount > 0 ? `${totalCount} results` : "No results found"}
    >
      {/* Sort select */}
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
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 15 }}>filter_list</span>
        Filter
      </button>
    </PageHeader>
  );
}
