"use client";
import { memo } from "react";
import { IconGlobe } from "@/lib/icons";

const STATUS_OPTS = [
  {
    value: "active",
    label: "Active",
    desc:  "Visible on storefront — customers can find and purchase this product.",
    dot:   "bg-green-500",
  },
  {
    value: "draft",
    label: "Draft",
    desc:  "Hidden from the store — save progress without publishing yet.",
    dot:   "bg-amber-400",
  },
];

export default memo(function StatusSideCard({ status, isPublic, onField }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-wide text-on-surface mb-4">
        Product Status
      </h3>

      <div className="space-y-2.5">
        {STATUS_OPTS.map(({ value, label, desc, dot }) => {
          const active = status === value;
          return (
            <label
              key={value}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                active
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/30 hover:bg-surface-container-low"
              }`}
            >
              <input
                type="radio"
                name="product-status"
                value={value}
                checked={active}
                onChange={() => onField("status", value)}
                className="mt-0.5 text-primary focus:ring-primary h-3.5 w-3.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface">{label}</p>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">{desc}</p>
              </div>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
            </label>
          );
        })}
      </div>

      {/* Visibility toggle */}
      <div className="mt-5">
        <h4 className="text-[10px] font-bold uppercase tracking-wide text-on-surface mb-3">
          Visibility
        </h4>
        <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-2">
            <IconGlobe size={15} className="text-primary" weight="bold" />
            <div>
              <p className="text-xs font-medium text-on-surface">Public on Store</p>
              <p className="text-[10px] text-on-surface-variant">Show in search &amp; listings</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onField("isPublic", !isPublic)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${
              isPublic ? "bg-primary" : "bg-outline-variant"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
});
