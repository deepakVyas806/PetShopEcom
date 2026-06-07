"use client";
import { memo } from "react";
import { IconInfo, IconRefresh } from "@/lib/icons";
import { CATEGORIES, BRANDS } from "../../data";

const CONTENT_CATS   = CATEGORIES.filter((c) => c !== CATEGORIES[0]);
const CONTENT_BRANDS = BRANDS.filter((b) => b !== BRANDS[0]);

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

export default memo(function GeneralInfoCard({ name, sku, stock, category, brand, onField, onRefreshSKU, skuReadOnly }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-xs font-bold text-on-surface mb-5 flex items-center gap-2">
        <IconInfo size={16} className="text-primary" weight="bold" />
        General Information
      </h3>

      <div className="space-y-4">
        {/* Product Name */}
        <div>
          <label className={lbl}>Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onField("name", e.target.value)}
            placeholder="e.g. Premium Lavender Scented Cat Litter 5kg"
            className={inp}
          />
        </div>

        {/* SKU + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>SKU {skuReadOnly ? "" : "(Auto-generated)"}</label>
            <div className="relative">
              <input
                type="text"
                value={sku}
                readOnly
                className={`${inp} pr-9 opacity-70 cursor-not-allowed`}
              />
              {!skuReadOnly && (
                <button
                  type="button"
                  onClick={onRefreshSKU}
                  title="Regenerate SKU"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary hover:rotate-180 transition-transform duration-300 cursor-pointer"
                >
                  <IconRefresh size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className={lbl}>Stock Quantity *</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => onField("stock", e.target.value)}
              placeholder="0"
              className={inp}
            />
          </div>
        </div>

        {/* Category + Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Category *</label>
            <select
              value={category}
              onChange={(e) => onField("category", e.target.value)}
              className={`${inp} cursor-pointer`}
            >
              {CONTENT_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Brand *</label>
            <select
              value={brand}
              onChange={(e) => onField("brand", e.target.value)}
              className={`${inp} cursor-pointer`}
            >
              {CONTENT_BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
});
