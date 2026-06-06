"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { IconFilter, IconSearch, IconClose } from "@/lib/icons";

export default function BreadcrumbsToolbar({
  totalCount,
  sortBy,
  setSortBy,
  onOpenMobileFilters,
  onListSearch,        // debounced inline search within current list
}) {
  const [localQuery, setLocalQuery] = useState("");

  /* Debounce: fire onListSearch 350ms after user stops typing */
  useEffect(() => {
    const timer = setTimeout(() => {
      onListSearch?.(localQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [localQuery, onListSearch]);

  return (
    <div className="mb-4">
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
          <IconFilter size={15} weight="regular" />
          Filter
        </button>
      </PageHeader>

      {/* Inline debounce search — filters current product list, no navigation */}
      <div className="mt-3 flex items-center bg-surface-container-low rounded-full px-3 py-2 border border-outline-variant/50 focus-within:border-primary transition-colors gap-2">
        <IconSearch size={16} className="text-on-surface-variant flex-shrink-0" weight="regular" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Filter products by name or description…"
          className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none text-on-surface placeholder:text-on-surface-variant/50 min-w-0"
        />
        {localQuery && (
          <button
            type="button"
            onClick={() => setLocalQuery("")}
            className="bg-transparent border-none cursor-pointer flex-shrink-0 text-on-surface-variant hover:text-on-surface"
          >
            <IconClose size={13} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
