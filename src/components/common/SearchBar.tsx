"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/currency";
import { getSuggestions, type SearchItem } from "@/lib/searchData";
import { IconSearch, IconClose, IconBag, IconCalendar, IconSearchOff } from "@/lib/icons";

interface Props {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearch?: (q: string) => void;
}

function SuggestionRow({ item, onSelect }: { item: SearchItem; onSelect: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors group"
    >
      {/* Thumbnail */}
      <div className="w-9 h-9 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
          {item.title}
        </p>
        <p className="text-[10px] text-on-surface-variant truncate">{item.subtitle}</p>
      </div>

      {/* Right: type badge + price */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <span className={cn(
          "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide",
          item.type === "product"
            ? "bg-primary/10 text-primary"
            : "bg-tertiary/10 text-tertiary"
        )}>
          {item.type === "product" ? item.category : "Service"}
        </span>
        <span className="text-[10px] font-bold text-primary">{fmt(item.price)}</span>
      </div>
    </Link>
  );
}

export default function SearchBar({ placeholder = "Search products & services…", className, inputClassName, onSearch }: Props) {
  const router = useRouter();
  const [query, setQuery]       = useState("");
  const [open,  setOpen]        = useState(false);
  const [active, setActive]     = useState(-1);  // keyboard nav index
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { products, services } = getSuggestions(query);
  const allSuggestions: SearchItem[] = [...products, ...services];
  const hasSuggestions = allSuggestions.length > 0 && query.trim().length >= 2;

  /* Close on outside click */
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

  const submit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    setActive(-1);
    setQuery("");
    onSearch?.(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [router, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !hasSuggestions) {
      if (e.key === "Enter") submit(query);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, allSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && allSuggestions[active]) {
        router.push(allSuggestions[active].href);
        setOpen(false); setQuery(""); setActive(-1);
      } else {
        submit(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false); setActive(-1);
    }
  };

  const selectAndClose = () => { setOpen(false); setQuery(""); setActive(-1); };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search input */}
      <div className="flex items-center bg-surface-container-low rounded-full px-3 py-2 border border-outline-variant/50 focus-within:border-primary transition-colors gap-2">
        <button
          type="button"
          onClick={() => submit(query)}
          className="bg-transparent border-none outline-none cursor-pointer flex items-center p-0 flex-shrink-0"
        >
          <IconSearch size={18} className="text-on-surface-variant" weight="regular" />
        </button>

        <input
          ref={inputRef}
          className={cn(
            "bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none text-on-surface placeholder:text-on-surface-variant/50 min-w-0",
            inputClassName
          )}
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="bg-transparent border-none outline-none cursor-pointer flex-shrink-0 text-on-surface-variant hover:text-on-surface"
          >
            <IconClose size={14} weight="regular" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && hasSuggestions && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-1.5 z-[60]",
          "bg-white/95 dark:bg-surface-container-lowest/95 backdrop-blur-xl",
          "border border-[#F3E8FF] dark:border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden"
        )}>

          {/* Products section */}
          {products.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-outline-variant/10 bg-surface-container-low/50">
                <IconBag size={13} className="text-primary" weight="regular" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Products</span>
              </div>
              {products.map((item, i) => (
                <div key={item.id} className={active === i ? "bg-surface-container-low" : ""}>
                  <SuggestionRow item={item} onSelect={selectAndClose} />
                </div>
              ))}
            </div>
          )}

          {/* Services section */}
          {services.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-outline-variant/10 bg-surface-container-low/50">
                <IconCalendar size={13} className="text-tertiary" weight="regular" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Services</span>
              </div>
              {services.map((item, i) => {
                const idx = products.length + i;
                return (
                  <div key={item.id} className={active === idx ? "bg-surface-container-low" : ""}>
                    <SuggestionRow item={item} onSelect={selectAndClose} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer: explicit search in each section */}
          <div className="flex border-t border-outline-variant/10">
            <Link
              href={`/marketplace?query=${encodeURIComponent(query)}`}
              onClick={selectAndClose}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-semibold text-primary hover:bg-primary/5 transition-colors border-r border-outline-variant/10"
            >
              <IconBag size={13} className="leading-none" weight="regular" />
              Search in Products
            </Link>
            <Link
              href={`/services?query=${encodeURIComponent(query)}`}
              onClick={selectAndClose}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-semibold text-tertiary hover:bg-tertiary/5 transition-colors"
            >
              <IconCalendar size={13} className="leading-none" weight="regular" />
              Search in Services
            </Link>
          </div>
        </div>
      )}

      {/* "No results" state */}
      {open && query.trim().length >= 2 && !hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-[60] bg-white/95 backdrop-blur-xl border border-[#F3E8FF] rounded-2xl shadow-2xl p-4 text-center">
          <IconSearchOff size={24} className="text-outline-variant" weight="regular" />
          <p className="text-xs text-on-surface-variant mt-1">No suggestions for "{query}"</p>
          <button
            onClick={() => submit(query)}
            className="mt-2 text-xs text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer"
          >
            Search anyway →
          </button>
        </div>
      )}
    </div>
  );
}
