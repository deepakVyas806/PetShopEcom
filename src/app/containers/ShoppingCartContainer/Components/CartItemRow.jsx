"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/app/containers/ReviewsContainer/Components/StarRating";
import { fmt } from "@/lib/currency";
import { StockBadge, DiscountBadge, Button } from "@/components/ui";
import { IconClose, IconCartSimple, IconBookmark, IconExternalLink } from "@/lib/icons";
export default function CartItemRow({ item, onUpdateQuantity, onRemoveItem }) {
  const { product, quantity } = item;
  const lineTotal    = product.price * quantity;
  const hasDiscount  = product.mrp && product.mrp > product.price;
  const discountPct  = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const [saved, setSaved] = useState(false);

  const handleSaveForLater = () => {
    // Add to wishlist (re-uses addToCart on a conceptual "wishlist" store key)
    // For now we store saved items in localStorage under "petshop_wishlist"
    try {
      const existing = JSON.parse(localStorage.getItem("petshop_wishlist") || "[]");
      const alreadyIn = existing.some((p) => p.id === product.id);
      if (!alreadyIn) {
        localStorage.setItem("petshop_wishlist", JSON.stringify([...existing, product]));
      }
    } catch {
      // silently ignore
    }
    // Remove from cart
    onRemoveItem(product.id);
    // Show feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="bg-white/80 dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl overflow-hidden hover:shadow-[0_4px_20px_rgba(124,58,237,0.08)] transition-all duration-300 group">

      {/* Main row */}
      <div className="flex gap-3 p-3">

        {/* Image — larger, square, discount badge overlaid */}
        <Link
          href={`/marketplace/${product.id}`}
          className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 block"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
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
                href={`/marketplace/${product.id}`}
                className="text-xs font-bold text-on-surface hover:text-primary transition-colors leading-tight line-clamp-2 block"
              >
                {product.name}
              </Link>
            </div>

            {/* Remove (X) */}
            <button
              onClick={() => onRemoveItem(product.id)}
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
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
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
                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer border-none outline-none bg-transparent text-sm font-bold"
                type="button"
              >
                +
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom strip — save for later */}
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
        <Button variant="ghost" size="sm" href={`/marketplace/${product.id}`}>
          <IconExternalLink size={12} className="leading-none" weight="regular" />
          View product
        </Button>
      </div>

    </div>
  );
}
