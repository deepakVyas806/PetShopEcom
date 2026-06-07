"use client";
import { memo } from "react";
import { IconPackage } from "@/lib/icons";

export default memo(function ProductPreviewCard({ name, basePrice, salePrice, image, category, status }) {
  const rawSale = Number(salePrice);
  const rawBase = Number(basePrice);
  const displayPrice  = rawSale > 0 ? rawSale : rawBase;
  const hasDiscount   = rawSale > 0 && rawBase > 0 && rawSale < rawBase;

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* Badge */}
      <div className="relative">
        <span className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm text-primary px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
          Preview
        </span>

        {/* Image area */}
        <div className="h-36 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Product preview"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/15" />
              <IconPackage size={40} className="text-on-surface-variant/20" weight="duotone" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Name */}
        {name ? (
          <p className="text-xs font-bold text-on-surface truncate">{name}</p>
        ) : (
          <div className="h-3.5 w-3/4 bg-surface-container rounded-full animate-pulse" />
        )}

        {/* Category */}
        {category ? (
          <p className="text-[10px] text-on-surface-variant">{category}</p>
        ) : (
          <div className="h-2.5 w-1/2 bg-surface-container rounded-full animate-pulse" />
        )}

        {/* Price row */}
        <div className="flex items-center justify-between pt-1">
          {displayPrice > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-primary">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-on-surface-variant line-through">
                  ₹{rawBase.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          ) : (
            <div className="h-4 w-16 bg-primary/10 rounded-full animate-pulse" />
          )}

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {status === "active" ? "Active" : "Draft"}
          </span>
        </div>
      </div>
    </section>
  );
});
