"use client";

import { fmt } from "@/lib/currency";

export default function OrderItemsList({ items }) {
  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-3">
      {items.map((item, idx) => (
        <div key={item.sku ?? item.productId?.toString() ?? idx} className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image || null}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-on-surface truncate">{item.name}</h4>
            {item.sku && <p className="text-[10px] text-on-surface-variant">SKU: {item.sku}</p>}
          </div>

          {/* Qty */}
          <span className="text-xs text-on-surface-variant flex-shrink-0">Qty: {item.quantity ?? item.qty}</span>

          {/* Price */}
          <span className="text-xs font-semibold text-on-surface flex-shrink-0 w-16 text-right">
            {fmt(item.price)}
          </span>
        </div>
      ))}
    </div>
  );
}
