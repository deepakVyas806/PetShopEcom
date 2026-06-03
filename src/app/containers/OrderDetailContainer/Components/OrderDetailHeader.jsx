"use client";

import Link from "next/link";

export default function OrderDetailHeader({ order }) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-4 text-xs text-on-surface-variant">
        <Link href="/orders" className="hover:text-primary transition-colors">Orders</Link>
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>chevron_right</span>
        <span className="text-on-surface">Order #{order.id}</span>
      </nav>

      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-sm font-bold text-on-surface">Order #{order.id}</h1>
          <p className="text-xs text-on-surface-variant">
            Placed on {order.date} • {order.time}
          </p>
          <div className="inline-flex items-center px-3 py-1 bg-primary-container/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft mr-2 flex-shrink-0" />
            <span className="text-xs font-bold text-primary-container">{order.statusLabel}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-xs font-medium hover:bg-surface-container transition-colors cursor-pointer bg-transparent">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
            Download Invoice
          </button>
          <Link
            href="/track-order"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:shadow-md transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_shipping</span>
            Track Shipment
          </Link>
        </div>
      </div>
    </div>
  );
}
