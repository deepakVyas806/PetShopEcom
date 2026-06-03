"use client";

import { fmt } from "@/lib/currency";

export default function OrderItemsList({ items }) {
  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-on-surface truncate">{item.name}</h4>
            <p className="text-[10px] text-on-surface-variant">{item.variant}</p>
          </div>

          {/* Qty */}
          <span className="text-xs text-on-surface-variant flex-shrink-0">Qty: {item.qty}</span>

          {/* Price */}
          <span className="text-xs font-semibold text-on-surface flex-shrink-0 w-16 text-right">
            {fmt(item.price)}
          </span>
        </div>
      ))}
    </div>
  );
}
