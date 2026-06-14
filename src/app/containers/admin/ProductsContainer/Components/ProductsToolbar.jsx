"use client";
import { memo } from "react";
import { IconSearch, IconDownload, IconAdd } from "@/lib/icons";
import { CATEGORIES as DEFAULT_CATS, BRANDS as DEFAULT_BRANDS } from "../data";

export default memo(function ProductsToolbar({
  search, onSearch,
  category, onCategory,
  brand, onBrand,
  categories,
  brands,
  onExport, onAdd,
}) {
  const CATEGORIES = categories ?? DEFAULT_CATS;
  const BRANDS     = brands     ?? DEFAULT_BRANDS;
  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-4">
      {/* Search */}
      <div className="flex-1 relative">
        <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search product name, SKU, or brand…"
          className="w-full pl-8 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          value={brand}
          onChange={(e) => onBrand(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          {BRANDS.map((b) => <option key={b}>{b}</option>)}
        </select>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-secondary-container text-on-secondary-fixed-variant rounded-xl text-xs font-semibold hover:shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <IconDownload size={13} weight="bold" />
          Export
        </button>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <IconAdd size={13} weight="bold" />
          Add Product
        </button>
      </div>
    </div>
  );
});
