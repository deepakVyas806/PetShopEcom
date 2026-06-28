"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/app/containers/ReviewsContainer/Components/StarRating";
import { fmt } from "@/lib/currency";
import { StockBadge, DiscountBadge, Button } from "@/components/ui";
import { IconClose, IconCartSimple, IconBookmark, IconExternalLink } from "@/lib/icons";

export default function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const { product, quantity } = item;
  const productId   = product._id ?? product.id;
  const lineTotal   = product.price * quantity;
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const [saved, setSaved] = useState(false);

  const handleSaveForLater = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("petshop_wishlist") || "[]");
      const alreadyIn = existing.some((p) => (p._id ?? p.id) === productId);
      if (!alreadyIn) {
        localStorage.setItem("petshop_wishlist", JSON.stringify([...existing, product]));
      }
    } catch { /* silent */ }
    onRemoveItem(productId);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div
      className={`bg-surface-container-lowest border rounded-xl overflow-hidden transition-all duration-300 group ${
        isSelected
          ? "border-primary/30 hover:shadow-card-md"
          : "border-outline-variant/20 opacity-60"
      }`}
    >
      {/* Main row */}
      <div className="flex gap-3 p-3">

        {/* Checkbox */}
        <div className="flex items-center shrink-0 pt-1">
          <button
            type="button"
            onClick={() => onToggleSelect(productId)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isSelected
                ? "bg-primary border-primary"
                : "bg-white border-outline-variant/50 hover:border-primary/50"
            }`}
            aria-label={isSelected ? "Deselect item" : "Select item"}
          >
            {isSelected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Image */}
        <Link
          href={`/marketplace/${productId}`}
          className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 block"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-surface-container" />
          )}
          {hasDiscount && (
            <span className="absolute top-1.5 left-1.5">
              <DiscountBadge pct={discountPct} />
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">

          {/* Top: meta + name + remove */}
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              {(product.brand || product.category) && (
                <p className="text-[9px] text-on-surface-variant font-medium mb-0.5 truncate">
                  {[product.brand, product.category && product.category.charAt(0).toUpperCase() + product.category.slice(1)]
                    .filter(Boolean).join(" · ")}
                </p>
              )}
              <Link
                href={`/marketplace/${productId}`}
                className="text-xs font-bold text-on-surface hover:text-primary transition-colors leading-tight line-clamp-2 block"
              >
                {product.name}
              </Link>
            </div>

            {/* Remove (X) */}
            <button
              onClick={() => onRemoveItem(productId)}
              className="p-1 -mt-0.5 -mr-0.5 flex items-center justify-center text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-full transition-colors cursor-pointer border-none outline-none bg-transparent shrink-0"
              type="button"
              title="Remove"
            >
              <IconClose size={15} weight="regular" />
            </button>
          </div>

          {/* Middle: rating + stock + delivery */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
            <StarRating rating={product.rating || 4.5} size={10} />
            <StockBadge inStock={true} />
            <span className="text-[9px] text-on-surface-variant">· Free delivery</span>
          </div>

          {/* Bottom: price + qty stepper */}
          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-primary leading-none">{fmt(lineTotal)}</span>
                {quantity > 1 && (
                  <span className="text-[9px] text-on-surface-variant">{fmt(product.price)} each</span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[9px] text-on-surface-variant line-through mt-0.5">
                  {fmt(product.mrp * quantity)}
                </p>
              )}
            </div>

            {/* Qty stepper */}
            <div className="flex items-center bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden select-none">
              <button
                onClick={() => onUpdateQuantity(productId, quantity - 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer border-none outline-none bg-transparent"
                type="button"
              >
                {quantity === 1
                  ? <IconCartSimple size={13} className="text-error leading-none" weight="regular" />
                  : <span className="text-primary text-sm font-bold leading-none">−</span>
                }
              </button>
              <span className="w-6 text-center text-xs font-bold text-on-surface border-x border-outline-variant/20 h-7 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(productId, quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer border-none outline-none bg-transparent text-sm font-bold"
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-outline-variant/10 px-3 py-1.5 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveForLater}
          type="button"
          className={saved ? "text-primary" : ""}
        >
          <IconBookmark size={12} className="leading-none" weight={saved ? "fill" : "regular"} />
          {saved ? "Saved!" : "Save for later"}
        </Button>
        <span className="text-outline-variant/30 text-xs">|</span>
        <Button variant="ghost" size="sm" href={`/marketplace/${productId}`}>
          <IconExternalLink size={12} className="leading-none" weight="regular" />
          View product
        </Button>
      </div>
    </div>
  );
}
