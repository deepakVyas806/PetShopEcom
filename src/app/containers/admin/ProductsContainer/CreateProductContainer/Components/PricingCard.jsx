"use client";
import { memo } from "react";
import { IconMoney, IconPercent } from "@/lib/icons";

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

export default memo(function PricingCard({ basePrice, salePrice, onField }) {
  const base = Number(basePrice);
  const sale = Number(salePrice);
  const discount = base > 0 && sale > 0 && sale < base
    ? Math.round((1 - sale / base) * 100)
    : null;

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-xs font-bold text-on-surface mb-5 flex items-center gap-2">
        <IconMoney size={16} className="text-primary" weight="bold" />
        Pricing
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Base Price (₹) *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={basePrice}
            onChange={(e) => onField("basePrice", e.target.value)}
            placeholder="3500"
            className={inp}
          />
          <p className="text-[10px] text-on-surface-variant mt-1">Regular listing price</p>
        </div>
        <div>
          <label className={lbl}>Sale Price (₹)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={salePrice}
            onChange={(e) => onField("salePrice", e.target.value)}
            placeholder="Leave blank for no discount"
            className={inp}
          />
          <p className="text-[10px] text-on-surface-variant mt-1">Optional discounted price</p>
        </div>
      </div>

      {discount !== null && (
        <div className="mt-4 flex items-center gap-2.5 p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <IconPercent size={14} className="text-green-600" weight="bold" />
          </div>
          <div>
            <p className="text-xs font-bold text-green-700">{discount}% discount applied</p>
            <p className="text-[10px] text-green-600">
              Customers save ₹{(base - sale).toLocaleString("en-IN")} — displayed with a strikethrough on the original price.
            </p>
          </div>
        </div>
      )}

      {salePrice && sale >= base && base > 0 && (
        <p className="mt-3 text-[10px] text-error">Sale price must be lower than base price.</p>
      )}
    </section>
  );
});
