"use client";

import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all",      label: "All Reviews"   },
  { key: "photos",   label: "With Photos"   },
  { key: "verified", label: "Verified Only" },
];

const SORT_OPTIONS = [
  { value: "recent",  label: "Most Recent"    },
  { value: "rating",  label: "Highest Rating" },
  { value: "helpful", label: "Most Helpful"   },
];

export default function ReviewFilters({ activeFilter, setActiveFilter, sortBy, setSortBy }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveFilter(key)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border-none cursor-pointer",
            activeFilter === key
              ? "bg-primary-container text-on-primary"
              : "bg-secondary-container text-on-secondary-container hover:bg-primary-container/20"
          )}
        >
          {label}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs font-bold text-on-surface-variant uppercase">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent border-none text-primary font-bold text-xs focus:ring-0 cursor-pointer outline-none"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
