"use client";
import { memo } from "react";
import { IconDownload, IconAdd } from "@/lib/icons";
import SearchInput from "@/components/common/SearchInput";

const selectCls = "bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer";

export default memo(function ProductsToolbar({
  search, onSearch,
  category, onCategory,
  brand, onBrand,
  categories = [],
  brands     = [],
  onExport, onAdd,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-4">
      {/* Search */}
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search product name, SKU, or brand…"
        className="flex-1"
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className={selectCls}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.value ?? c} value={c.value ?? c}>{c.label ?? c}</option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => onBrand(e.target.value)}
          className={selectCls}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.value ?? b} value={b.value ?? b}>{b.label ?? b}</option>
          ))}
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
