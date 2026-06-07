"use client";
import { memo } from "react";
import { IconAdd, IconDelete, IconGrid } from "@/lib/icons";

const cell = "px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 w-full";

export default memo(function VariantsCard({ variants, onAdd, onUpdate, onRemove }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold text-on-surface flex items-center gap-2">
            <IconGrid size={16} className="text-primary" weight="bold" />
            Variants
            <span className="text-[10px] font-normal text-on-surface-variant">(optional)</span>
          </h3>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Offer different sizes, weights, or pack counts of the same product.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/40 rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer flex-shrink-0"
        >
          <IconAdd size={13} weight="bold" /> Add
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-5 text-[10px] text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant/50">
          No variants yet — e.g. 1 kg · 5 kg · 10 kg with separate prices and stock.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_80px_36px] gap-2 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant px-1">
            <span>Variant / Size</span>
            <span>Price (₹)</span>
            <span>Stock</span>
            <span />
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_80px_36px] gap-2 items-center">
              <input
                type="text"
                value={v.name}
                onChange={(e) => onUpdate(i, "name", e.target.value)}
                placeholder="e.g. 5 kg"
                className={cell}
              />
              <input
                type="number"
                min="0"
                value={v.price}
                onChange={(e) => onUpdate(i, "price", e.target.value)}
                placeholder="3500"
                className={cell}
              />
              <input
                type="number"
                min="0"
                value={v.stock}
                onChange={(e) => onUpdate(i, "stock", e.target.value)}
                placeholder="100"
                className={cell}
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all cursor-pointer"
              >
                <IconDelete size={14} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});
