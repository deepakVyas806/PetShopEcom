"use client";
import { memo } from "react";
import { IconChevronLeft, IconChevronRight } from "@/lib/icons";

const PAGE_BUTTONS = [1, 2, 3];

export default memo(function OrdersPagination({ total, page, perPage = 6, onPageChange }) {
  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);

  return (
    <div className="px-4 py-3 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-3 bg-surface-container-low/20">
      <p className="text-[10px] text-on-surface-variant">
        Showing {from}–{to} of {total.toLocaleString()} orders
      </p>

      <div className="flex items-center gap-1.5">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-outline-variant rounded-lg text-[10px] font-semibold hover:bg-surface-variant transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <IconChevronLeft size={11} weight="bold" /> Prev
        </button>

        {PAGE_BUTTONS.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              p === page ? "bg-primary text-on-primary" : "hover:bg-surface-variant text-on-surface"
            }`}
          >
            {p}
          </button>
        ))}

        <span className="text-xs text-on-surface-variant px-1">…</span>

        <button
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-outline-variant rounded-lg text-[10px] font-semibold hover:bg-surface-variant transition-all cursor-pointer"
        >
          Next <IconChevronRight size={11} weight="bold" />
        </button>
      </div>
    </div>
  );
});
