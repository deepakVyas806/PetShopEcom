"use client";

export default function OrdersHeader({ searchQuery, onSearch }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div>
        <h1 className="text-sm font-bold text-on-surface">My Orders</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">Track and manage your purchases.</p>
      </div>
      <div className="relative w-full sm:w-56">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 16 }}>
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search orders…"
          className="w-full pl-8 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-xs text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>
    </div>
  );
}
