"use client";

import { fmt } from "@/lib/currency";
import { IconTag } from "@/lib/icons";

export default function OrderSummaryCard({ subtotal, shippingCost, tax, discount, couponCode, total }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-card-sm">
      <h2 className="text-xs font-bold text-on-surface mb-4 pb-3 border-b border-outline-variant/20">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-medium text-on-surface">{fmt(subtotal ?? 0)}</span>
        </div>
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Shipping</span>
          <span className={`font-medium ${shippingCost === 0 ? "text-success font-bold" : "text-on-surface"}`}>
            {shippingCost === 0 ? "FREE" : fmt(shippingCost ?? 0)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Taxes</span>
          <span className="font-medium text-on-surface">{fmt(tax ?? 0)}</span>
        </div>
        {discount > 0 && (
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

        <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
          <span className="text-xs font-bold text-on-surface">Total Paid</span>
          <span className="text-sm font-extrabold text-primary">{fmt(total ?? 0)}</span>
        </div>
      </div>
    </section>
  );
}
