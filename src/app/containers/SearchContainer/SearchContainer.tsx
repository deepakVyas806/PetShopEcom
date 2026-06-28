"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/currency";
import { getSuggestions, ALL_SEARCH_ITEMS, type SearchItem, scoreItem } from "@/lib/searchData";
import SearchBar from "@/components/common/SearchBar";
import StarRating from "@/app/containers/ReviewsContainer/Components/StarRating";
import type { ComponentType } from "react";
import { IconChevronRight, IconSearchOff, IconSearch, IconBag, IconCalendar } from "@/lib/icons";

type Tab = "all" | "products" | "services";

function ResultCard({ item }: { item: SearchItem }) {
  return (
    <Link
      href={item.href}
      className="group bg-white/80 dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <span className={cn(
          "absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
          item.type === "product"
            ? "bg-primary text-white"
            : "bg-tertiary text-white"
        )}>
          {item.type === "product" ? item.category : "Service"}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {item.rating != null && (
          <div className="flex items-center gap-1 mb-1">
            <StarRating rating={item.rating} size={10} />
            <span className="text-[10px] text-on-surface-variant">{item.rating}</span>
          </div>
        )}
        <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1">
          {item.title}
        </h3>
        <p className="text-[10px] text-on-surface-variant line-clamp-2 flex-1">{item.subtitle}</p>
        <div className="mt-2 pt-2 border-t border-outline-variant/10 flex items-center justify-between">
          <span className="text-xs font-extrabold text-primary">{fmt(item.price)}</span>
          <span className="text-[10px] text-on-surface-variant font-medium">
            {item.type === "product" ? "Add to cart" : "Book now"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SearchContainer() {
  const params = useSearchParams();
  const query  = params.get("q") || "";
  const [tab, setTab] = useState<Tab>("all");

  const results = useMemo(() => {
    if (!query.trim()) return { all: [], products: [], services: [] };
    const q = query.trim();
    const scored = ALL_SEARCH_ITEMS
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
    return {
      all:      scored,
      products: scored.filter((i) => i.type === "product"),
      services: scored.filter((i) => i.type === "service"),
    };
  }, [query]);

  const shown = results[tab];
  const TABS: { key: Tab; label: string; count: number; Icon: ComponentType<any> }[] = [
    { key: "all",      label: "All",      count: results.all.length,      Icon: IconSearch   },
    { key: "products", label: "Products", count: results.products.length, Icon: IconBag      },
    { key: "services", label: "Services", count: results.services.length, Icon: IconCalendar },
  ];

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">

      {/* Page header */}
      <div className="mb-4">
        <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <IconChevronRight size={12} weight="bold" />
          <span className="text-on-surface font-semibold">
            {query ? `Search results for "${query}"` : "Search"}
          </span>
        </nav>
        <h1 className="text-sm font-bold text-on-surface">
          {query
            ? `${results.all.length} result${results.all.length !== 1 ? "s" : ""} for "${query}"`
            : "Search artPetShop"
          }
        </h1>
      </div>

      {/* Search bar — refine query */}
      <div className="mb-4">
        <SearchBar
          placeholder="Refine your search…"
          className="max-w-lg"
        />
      </div>

      {query && results.all.length > 0 && (
        <>
          {/* Tab filter */}
          <div className="flex gap-1 mb-4 bg-surface-container-low rounded-xl p-1 border border-outline-variant/20 w-fit">
            {TABS.map(({ key, label, count, Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-none outline-none",
                  tab === key
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-primary hover:bg-white/60"
                )}
              >
                <Icon size={13} weight="regular" />
                {label}
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                  tab === key ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant"
                )}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Results grid */}
          {shown.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {shown.map((item) => (
                <ResultCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <IconSearchOff size={36} className="text-outline-variant" weight="duotone" />
              <p className="text-xs text-on-surface-variant mt-2">
                No {tab === "all" ? "results" : tab} found for "{query}"
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty — no query */}
      {!query && (
        <div className="py-16 text-center space-y-3">
          <IconSearch size={60} className="text-on-surface-variant/30" weight="duotone" />
          <p className="text-xs text-on-surface-variant">Type something to search products and services</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["grooming", "dog food", "cat collar", "vet checkup", "training", "bowl"].map((q) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs text-on-surface-variant hover:border-primary hover:text-primary transition-colors capitalize"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results for query */}
      {query && results.all.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <IconSearchOff size={36} className="text-outline-variant" weight="duotone" />
          <p className="text-xs font-bold text-on-surface">No results for "{query}"</p>
          <p className="text-xs text-on-surface-variant">Try a different keyword or browse our categories</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Link href="/marketplace" className="px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:shadow-md transition-all">
              Browse Products
            </Link>
            <Link href="/services" className="px-4 py-2 border border-primary text-primary rounded-full text-xs font-semibold hover:bg-primary/5 transition-all">
              Browse Services
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
