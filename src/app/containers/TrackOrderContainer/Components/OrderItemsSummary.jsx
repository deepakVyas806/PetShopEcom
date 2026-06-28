"use client";

import { fmt } from "@/lib/currency";
import { IconBag, IconTag } from "@/lib/icons";

export default function OrderItemsSummary({ items, subtotal, tax, discount, couponCode, shipping, total }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <IconBag size={15} className="text-primary" weight="regular" />
        <h3 className="text-xs font-bold text-on-surface">
          Order Items
          <span className="ml-1.5 text-on-surface-variant font-normal">({items.length})</span>
        </h3>
      </div>

      {/* Items list */}
      <div className="divide-y divide-outline-variant/15">
        {items.map((item, idx) => (
          <div key={item.sku ?? item.productId?.toString() ?? idx} className="px-5 py-3 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-surface-variant flex-shrink-0 overflow-hidden">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{item.name}</p>
              {item.sku && <p className="text-[10px] text-on-surface-variant mt-0.5">SKU: {item.sku}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-primary">{fmt(item.price)}</p>
              <p className="text-[10px] text-on-surface-variant">×{item.quantity ?? item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-5 py-4 border-t border-outline-variant/20 space-y-1.5">
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-medium text-on-surface">{fmt(subtotal ?? 0)}</span>
        </div>
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Shipping</span>
          <span className={shipping === 0 ? "font-bold text-success" : "font-medium text-on-surface"}>
            {shipping === 0 ? "Free" : fmt(shipping ?? 0)}
          </span>
        </div>
        {(tax ?? 0) > 0 && (
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>
              Taxes
              {(subtotal ?? 0) > 0 && (
                <span className="ml-1 text-[10px] text-on-surface-variant/70">
                  ({Math.round((tax / subtotal) * 100)}%)
                </span>
              )}
            </span>
            <span className="font-medium text-on-surface">{fmt(tax)}</span>
          </div>
        )}
        {(discount ?? 0) > 0 && (
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              Discount
              {couponCode && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 border border-success/20 px-1.5 py-0.5 rounded-full">
                  <IconTag size={9} weight="fill" />
                  {couponCode}
                </span>
              )}
            </span>
            <span className="font-bold text-success">−{fmt(discount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-outline-variant/20">
          <span className="text-xs font-bold text-on-surface">Total</span>
          <span className="text-xs font-extrabold text-primary">{fmt(total ?? 0)}</span>
        </div>
      </div>
    </section>
  );
}
