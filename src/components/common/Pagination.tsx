"use client";

import { cn } from "@/lib/utils";
import { IconChevronDown, IconChevronLeft, IconChevronRight } from "@/lib/icons";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface PaginationProps {
  /** "pages" = numbered prev/next  |  "load-more" = single load-more button */
  variant?: "pages" | "load-more";

  // ── pages variant ────────────────────────────────────────────────────────
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  // ── load-more variant ────────────────────────────────────────────────────
  hasMore?: boolean;
  onLoadMore?: () => void;
  label?: string;          // button label — default "Load More"
  loading?: boolean;       // shows spinner on the load-more button

  className?: string;
}

/* ─── Smart page list (with ellipsis) ───────────────────────────────────────── */
function getPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function Pagination({
  variant     = "pages",
  currentPage = 1,
  totalPages  = 1,
  onPageChange,
  hasMore     = false,
  onLoadMore,
  label       = "Load More",
  loading     = false,
  className   = "",
}: PaginationProps) {

  /* ── Load-more variant ───────────────────────────────────────────────────── */
  if (variant === "load-more") {
    if (!hasMore) return null;
    return (
      <div className={cn("flex justify-center pt-5", className)}>
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-2.5 border border-outline-variant text-primary text-xs font-semibold rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading…
            </>
          ) : (
            <>
              <IconChevronDown size={15} className="leading-none" weight="regular" />
              {label}
            </>
          )}
        </button>
      </div>
    );
  }

  /* ── Numbered pages variant ──────────────────────────────────────────────── */
  if (totalPages <= 1) return null;

  const pages = getPages(currentPage, totalPages);

  const btnBase =
    "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all cursor-pointer border";

  return (
    <div className={cn("flex justify-center items-center gap-1.5 pt-5 select-none", className)}>
      {/* Prev */}
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(btnBase, "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed bg-transparent")}
        aria-label="Previous page"
      >
        <IconChevronLeft size={16} className="leading-none" weight="regular" />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-on-surface-variant">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange?.(p as number)}
            className={cn(
              btnBase,
              p === currentPage
                ? "bg-primary text-on-primary border-primary shadow-brand-sm"
                : "border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary bg-transparent"
            )}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(btnBase, "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed bg-transparent")}
        aria-label="Next page"
      >
        <IconChevronRight size={16} className="leading-none" weight="regular" />
      </button>
    </div>
  );
}
