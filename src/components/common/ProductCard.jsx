"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import CartButton from "./CartButton";
import { fmt } from "@/lib/currency";

function StarRow({ rating }) {
  return (
    <div className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half   = !filled && rating >= i - 0.5;
        return (
          <span
            key={i}
            className="material-symbols-outlined leading-none"
            style={{ fontSize: 10, fontVariationSettings: filled || half ? "'FILL' 1" : "'FILL' 0" }}
          >
            {half ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}

function Badges({ badge, badges }) {
  const list =
    badges?.length > 0
      ? badges
      : badge
      ? [{ label: badge, cls: badge.toLowerCase().includes("sale") ? "bg-primary text-white" : "bg-secondary text-white" }]
      : [];
  if (!list.length) return null;
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {list.map(({ label, cls, dot, dotCls }) => (
        <span key={label} className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1", cls)}>
          {dot && <span className={cn("w-1 h-1 rounded-full flex-shrink-0", dotCls)} />}
          {label}
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({
  product,
  isFavorite         = false,
  onToggleFavorite,
  isAdded            = false,
  onAddToCart,
  badges,
  topRightSlot,
  ctaSlot,
  stockOverlay       = false,
  isMoving           = false,
}) {
  const hasHeart = !topRightSlot && Boolean(onToggleFavorite);

  return (
    <article className={cn(
      "group bg-white/80 dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl overflow-hidden",
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      "flex flex-col text-left",
      isMoving && "opacity-0 translate-y-4 pointer-events-none"
    )}>

      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        <Link href={`/marketplace/${product.id}`} className="block w-full h-full">
          <img
            alt={product.name}
            src={product.image}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              stockOverlay && "opacity-60"
            )}
          />
        </Link>

        {stockOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
            <span className="bg-surface-container-highest text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-outline-variant">
              Sold Out
            </span>
          </div>
        )}

        <Badges badge={product.badge} badges={badges} />

        {topRightSlot ? (
          <div className="absolute top-2 right-2 z-10">{topRightSlot}</div>
        ) : hasHeart ? (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur shadow-sm rounded-full text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer active:scale-95 flex items-center justify-center border-none outline-none z-10"
            title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        ) : null}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">

        {product.rating != null && (
          <div className="flex items-center gap-1 mb-1 select-none">
            <StarRow rating={product.rating} />
            {product.reviewsCount != null && (
              <span className="text-[10px] text-on-surface-variant">({product.reviewsCount})</span>
            )}
          </div>
        )}

        {product.meta && (
          <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter mb-0.5">{product.meta}</p>
        )}

        <h4 className="text-xs font-bold text-on-surface mb-1 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          <Link href={`/marketplace/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h4>

        {product.description && (
          <p className="text-xs text-on-surface-variant mb-2 flex-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {!product.description && <div className="flex-1" />}

        {(onAddToCart || ctaSlot) && (
          <div className="flex items-center justify-between mt-1.5 pt-2 border-t border-outline-variant/10">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-primary">{fmt(product.price)}</span>
              {product.mrp && (
                <span className="text-[10px] text-on-surface-variant line-through leading-none mt-0.5">
                  {fmt(product.mrp)}
                </span>
              )}
            </div>
            {ctaSlot ?? (
              <CartButton onClick={() => onAddToCart(product)} isAdded={isAdded} variant="icon" />
            )}
          </div>
        )}

        {!onAddToCart && !ctaSlot && (
          <div className="mt-1.5 pt-2 border-t border-outline-variant/10">
            <span className="text-xs font-extrabold text-primary">{fmt(product.price)}</span>
            {product.mrp && (
              <span className="text-[10px] text-on-surface-variant line-through ml-1.5">{fmt(product.mrp)}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
