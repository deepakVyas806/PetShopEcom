"use client";

import { fmt } from "@/lib/currency";
import { IconBag } from "@/lib/icons";

export default function OrderItemsSummary({ items, subtotal, shipping, total }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/20 flex items-center gap-2">
        <IconBag size={18} className="text-primary" weight="bold" />
        <h2 className="text-sm font-bold text-on-surface">
          Order Items ({items.length})
        </h2>
      </div>

      {/* Items list */}
      <div className="divide-y divide-outline-variant/20">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex gap-3 items-center">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg bg-surface-variant flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
              <h4 className="text-xs font-semibold text-on-surface truncate">{item.name}</h4>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{item.variant}</p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-primary">{fmt(item.price)}</p>
              <p className="text-[10px] text-on-surface-variant">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-4 bg-surface-container-low space-y-1.5">
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-medium text-on-surface">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Shipping</span>
          <span className="font-semibold text-green-600">
            {shipping === 0 ? "Free" : fmt(shipping)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-outline-variant/20">
          <span className="text-sm font-bold text-on-surface">Total</span>
          <span className="text-sm font-extrabold text-primary">{fmt(total)}</span>
        </div>
      </div>
    </section>
  );
}
