"use client";

import { fmt } from "@/lib/currency";
import { IconRefresh } from "@/lib/icons";

export default function OrderDetailItems({ items }) {
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: "1px solid #F3E8FF", boxShadow: "0 10px 25px -5px rgba(124,58,237,0.05)" }}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-outline-variant/20 flex items-center justify-between">
        <h2 className="text-xs font-bold text-on-surface">Order Items ({items.length})</h2>
        <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer p-0">
          <IconRefresh size={15} weight="bold" />
          Reorder All
        </button>
      </div>

      {/* Items list */}
      <div className="divide-y divide-outline-variant/20">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-5 py-4 flex gap-4 items-center group hover:bg-surface/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
              <h3 className="text-xs font-semibold text-on-surface truncate">{item.name}</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Qty: {item.qty}</p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-primary">{fmt(item.price)}</p>
              {item.originalPrice && (
                <p className="text-[10px] text-on-surface-variant line-through">
                  {fmt(item.originalPrice)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
