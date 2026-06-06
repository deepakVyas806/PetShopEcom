"use client";

export default function ServicesCategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div
      className="flex gap-1 overflow-x-auto mb-3 bg-surface-container-low rounded-xl p-1 border border-outline-variant/20"
      style={{ scrollbarWidth: "none" }}
    >
      {categories.map((cat) => {
        const isActive = cat.key === activeCategory;
        return (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none active:scale-95 cursor-pointer border-none outline-none flex-shrink-0 ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-white/60"
            }`}
          >
            <cat.Icon size={13} className="leading-none" weight="regular" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
