"use client";

export default function OrdersHeader({ searchQuery, onSearch }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-sm font-bold text-on-surface">My Orders</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Review and track your recent artPetShop purchases.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-60">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          style={{ fontSize: 18 }}
        >
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Filter by ID or product..."
          className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:border-primary outline-none transition-all text-xs text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>
    </div>
  );
}
