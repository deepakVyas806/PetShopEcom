"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import CartButton from "./CartButton";

/* ─── Star rating row ────────────────────────────────────────────────────────── */
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
            style={{
              fontSize: 10,
              fontVariationSettings: filled || half ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {half ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}

/* ─── Badge chips ─────────────────────────────────────────────────────────────── */
function Badges({ badge, badges }) {
  const list =
    badges && badges.length > 0
      ? badges
      : badge
      ? [{ label: badge, cls: badge.toLowerCase().includes("sale") ? "bg-primary text-white" : "bg-secondary text-white" }]
      : [];

  if (list.length === 0) return null;

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
      {list.map(({ label, cls, dot, dotCls }) => (
        <span
          key={label}
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1",
            cls
          )}
        >
          {dot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotCls)} />}
          {label}
        </span>
      ))}
    </div>
  );
}

/**
 * Global ProductCard — vertical layout (image top, info below).
 *
 * Core props:
 *   product            – { id, name, image, price, mrp?, badge?, rating?, reviewsCount?, description?, meta? }
 *   isFavorite         – boolean
 *   onToggleFavorite   – (productId) => void
 *   isAdded            – boolean
 *   onAddToCart        – (product) => void
 *
 * Extension props (wishlist / custom contexts):
 *   badges             – { label, cls, dot?, dotCls? }[]
 *   topRightSlot       – ReactNode — replaces heart button
 *   ctaSlot            – ReactNode — replaces add-to-cart button
 *   stockOverlay       – boolean — "Sold Out" overlay + dimmed image
 *   isMoving           – boolean — fade-out animation
 */
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
    <article
      className={cn(
        "group bg-surface-container-lowest border border-[#F3E8FF] rounded-xl overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        "flex flex-col text-left",
        isMoving && "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* ── Image area ─────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        <Link href={`/marketplace/${product.id}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={product.name}
            src={product.image}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              stockOverlay && "opacity-60"
            )}
          />
        </Link>

        {/* Sold-out overlay */}
        {stockOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
            <span className="bg-surface-container-highest text-on-surface-variant text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-outline-variant">
              Sold Out
            </span>
          </div>
        )}

        {/* Badges — top left */}
        <Badges badge={product.badge} badges={badges} />

        {/* Top-right: custom slot OR heart */}
        {topRightSlot ? (
          <div className="absolute top-3 right-3 z-10">{topRightSlot}</div>
        ) : hasHeart ? (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer active:scale-95 flex items-center justify-center border-none outline-none z-10"
            title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        ) : null}
      </div>

      {/* ── Info area ──────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Star rating */}
        {product.rating != null && (
          <div className="flex items-center gap-1 mb-2 select-none">
            <StarRow rating={product.rating} />
            {product.reviewsCount != null && (
              <span className="text-xs text-on-surface-variant font-medium">
                ({product.reviewsCount})
              </span>
            )}
          </div>
        )}

        {/* Meta (e.g. "Dogs · Accessories") */}
        {product.meta && (
          <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mb-1">
            {product.meta}
          </p>
        )}

        {/* Name */}
        <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          <Link href={`/marketplace/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h4>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-on-surface-variant mb-4 flex-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Spacer when no description */}
        {!product.description && <div className="flex-1" />}

        {/* Price + CTA */}
        {(onAddToCart || ctaSlot) && (
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant/10">
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.mrp && (
                <span className="text-xs text-on-surface-variant line-through font-medium leading-none mt-0.5">
                  ${product.mrp.toFixed(2)}
                </span>
              )}
            </div>

            {ctaSlot ? ctaSlot : (
              <CartButton
                onClick={() => onAddToCart(product)}
                isAdded={isAdded}
                variant="icon"
              />
            )}
          </div>
        )}

        {/* Price only (no CTA) */}
        {!onAddToCart && !ctaSlot && (
          <div className="mt-2 pt-3 border-t border-outline-variant/10">
            <span className="text-sm font-extrabold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.mrp && (
              <span className="text-xs text-on-surface-variant line-through font-medium ml-2">
                ${product.mrp.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
