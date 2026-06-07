"use client";
import { memo } from "react";
import { IconChevronLeft, IconChevronRight } from "@/lib/icons";

const PER_PAGE_OPTIONS = [10, 25, 50];

function buildPages(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default memo(function ProductsPagination({ total, page, perPage, onPageChange, onPerPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);
  const pages = buildPages(page, totalPages);

  return (
    <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="flex items-center gap-4">
        <p className="text-[10px] text-on-surface-variant">
          Showing <span className="font-bold">{from}–{to}</span> of{" "}
          <span className="font-bold">{total.toLocaleString()}</span> products
        </p>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-outline">Rows:</label>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer outline-none text-on-surface"
          >
            {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <IconChevronLeft size={14} weight="bold" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-xs text-outline">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                p === page
                  ? "bg-primary text-on-primary shadow-sm"
                  : "hover:bg-surface-variant text-on-surface"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <IconChevronRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
});
