"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/currency";
import { api } from "@/lib/api";
import { IconSearch, IconClose, IconSearchOff } from "@/lib/icons";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  brand?: string;
}

interface Props {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearch?: (q: string) => void;
}

export default function SearchBar({
  placeholder = "Search products & services…",
  className,
  inputClassName,
  onSearch,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [open,        setOpen]        = useState(false);
  const [active,      setActive]      = useState(-1);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch suggestions from real API
  const fetchSuggestions = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(q.trim())}&limit=6`)
      .then((data: any) => {
        setResults(data.products ?? []);
        setOpen(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActive(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const submit = useCallback((q: string) => {
    const trimmed = q.trim();
    setOpen(false);
    setActive(-1);
    setQuery("");
    if (!trimmed) return;
    onSearch?.(trimmed);
    router.push(`/marketplace?query=${encodeURIComponent(trimmed)}`);
  }, [router, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setOpen(false); setActive(-1); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) {
        router.push(`/marketplace/${results[active]._id}`);
        setOpen(false); setQuery(""); setActive(-1);
      } else {
        submit(query);
      }
    }
  };

  const selectItem = (product: Product) => {
    setOpen(false); setQuery(""); setActive(-1);
    router.push(`/marketplace/${product._id}`);
  };

  const hasResults = results.length > 0;
  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className={cn("relative", className)}>

      {/* Input — same style as SearchInput */}
      <div className="relative">
        <button
          type="button"
          onClick={() => submit(query)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none cursor-pointer p-0 flex items-center"
          tabIndex={-1}
          aria-label="Search"
        >
          <IconSearch
            size={14}
            weight="regular"
            className={cn(
              "transition-colors duration-150",
              loading ? "text-primary animate-pulse" : "text-on-surface-variant"
            )}
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full pl-8 pr-8 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl",
            "text-xs text-on-surface placeholder:text-on-surface-variant/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            inputClassName
          )}
        />

        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none cursor-pointer text-on-surface-variant hover:text-on-surface p-0"
          >
            <IconClose size={12} weight="bold" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-1.5 z-[60]",
          "bg-surface-container-lowest/95 backdrop-blur-md",
          "border border-outline-variant/30 rounded-2xl shadow-card-lg overflow-hidden"
        )}>
          {hasResults ? (
            <>
              {results.map((product, i) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => selectItem(product)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-none cursor-pointer",
                    i === active
                      ? "bg-surface-container-low"
                      : "bg-transparent hover:bg-surface-container-low"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconSearch size={14} className="text-outline-variant" />
                      </div>
                    )}
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">{product.name}</p>
                    {product.category && (
                      <p className="text-[10px] text-on-surface-variant truncate capitalize">{product.category}</p>
                    )}
                  </div>

                  {/* Price */}
                  <span className="text-xs font-bold text-primary flex-shrink-0">
                    {fmt(product.price)}
                  </span>
                </button>
              ))}

              {/* Footer — search all */}
              <Link
                href={`/marketplace?query=${encodeURIComponent(query)}`}
                onClick={() => { setOpen(false); setQuery(""); }}
                className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-outline-variant/10"
              >
                <IconSearch size={11} />
                Search &ldquo;{query}&rdquo; in all products
              </Link>
            </>
          ) : (
            // No results
            !loading && (
              <div className="px-4 py-5 text-center">
                <IconSearchOff size={24} className="text-outline-variant mx-auto mb-1.5" weight="regular" />
                <p className="text-xs text-on-surface-variant">No results for &ldquo;{query}&rdquo;</p>
                <button
                  onClick={() => submit(query)}
                  className="mt-2 text-xs text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Search anyway →
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
