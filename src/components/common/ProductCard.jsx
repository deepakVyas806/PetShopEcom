"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import CartButton from "./CartButton";
import { IconHeart, IconCart } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import { useStore } from "@/context/StoreContext";

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
  layout             = "card",   // "card" | "list"
}) {
  const { cart } = useStore();
  const productId = product._id ?? product.id;
  const isInCart  = cart.some((item) => (item.product._id ?? item.product.id) === productId);

  const hasHeart = !topRightSlot && Boolean(onToggleFavorite);
  const discount =
    product.mrp && product.price && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const badgeList =
    badges?.length > 0
      ? badges
      : product.badge
      ? [{ label: product.badge, variant: product.badge.toLowerCase().includes("sale") ? "primary" : "secondary" }]
      : [];

  /* ── LIST layout ──────────────────────────────────────────────────────── */
  if (layout === "list") {
    return (
      <article
        className={cn(
          "group bg-white dark:bg-surface-container-lowest rounded-lg overflow-hidden",
          "border border-gray-100 dark:border-outline-variant/10",
          "transition-all duration-200 hover:shadow-lg",
          "flex flex-row gap-0 text-left",
          isMoving && "opacity-0 pointer-events-none"
        )}
      >
        {/* Image */}
        <Link
          href={`/marketplace/${product._id ?? product.id}`}
          className="relative w-28 sm:w-36 shrink-0 bg-gray-50 dark:bg-surface-container-low overflow-hidden aspect-square"
        >
          <img
            alt={product.name}
            src={product.image}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              stockOverlay && "opacity-40"
            )}
          />
          {discount != null && discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-black px-1 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
          {stockOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="bg-white text-on-surface text-[9px] font-bold px-2 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            {(product.brand || product.meta) && (
              <p className="text-[9px] text-on-surface-variant font-semibold uppercase tracking-wider mb-0.5">
                {product.brand || product.meta}
              </p>
            )}
            <h4 className="text-sm font-medium text-on-surface mb-1 line-clamp-2 leading-snug">
              <Link href={`/marketplace/${product._id ?? product.id}`} className="hover:text-primary transition-colors">
                {product.name}
              </Link>
            </h4>
            {product.description && (
              <p className="text-xs text-on-surface-variant line-clamp-1 mb-1.5">{product.description}</p>
            )}
            {product.rating != null && (
              <div className="flex items-center gap-1 mb-1.5">
                <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {product.rating} ★
                </span>
                {product.reviewsCount != null && (
                  <span className="text-[10px] text-on-surface-variant">({product.reviewsCount >= 1000 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount})</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-on-surface">{fmt(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-on-surface-variant line-through">{fmt(product.mrp)}</span>
              )}
              {discount != null && discount > 0 && (
                <span className="text-xs font-bold text-green-600">{discount}% off</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {hasHeart && (
                <button
                  onClick={(e) => { e.preventDefault(); onToggleFavorite(product._id ?? product.id); }}
                  className={cn(
                    "p-1.5 rounded-full border border-outline-variant/30 transition-all cursor-pointer",
                    isFavorite ? "bg-primary text-white border-primary" : "text-gray-400 hover:text-primary bg-surface"
                  )}
                >
                  <IconHeart size={13} weight={isFavorite ? "fill" : "regular"} />
                </button>
              )}
              {!ctaSlot && (
                isInCart ? (
                  <Link
                    href="/cart"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white text-[11px] font-bold hover:brightness-110 transition-colors"
                  >
                    <IconCart size={13} weight="fill" />
                    Go to Cart
                  </Link>
                ) : onAddToCart ? (
                  <CartButton onClick={() => onAddToCart(product)} isAdded={isAdded} variant="pill" label="Add to Cart" />
                ) : null
              )}
              {ctaSlot}
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ── CARD layout (default) ───────────────────────────────────────────── */
  return (
    <article
      className={cn(
        "group bg-white dark:bg-surface-container-lowest rounded-lg overflow-hidden",
        "border border-gray-100 dark:border-outline-variant/10",
        "transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5",
        "flex flex-col text-left",
        isMoving && "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 dark:bg-surface-container-low overflow-hidden">
        <Link href={`/marketplace/${product._id ?? product.id}`} className="block w-full h-full">
          <img
            alt={product.name}
            src={product.image}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              stockOverlay && "opacity-40"
            )}
          />
        </Link>

        {stockOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
            <span className="bg-white text-on-surface text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}

        {/* Custom badges */}
        {badgeList.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {badgeList.map(({ label, variant = "secondary" }) => (
              <span
                key={label}
                className={cn(
                  "text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider",
                  variant === "primary"
                    ? "bg-primary text-white"
                    : "bg-white/90 text-on-surface border border-outline-variant/30"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist / top-right slot */}
        {topRightSlot ? (
          <div className="absolute top-2 right-2 z-10">{topRightSlot}</div>
        ) : hasHeart ? (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(product._id ?? product.id); }}
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-all duration-200",
              "cursor-pointer active:scale-90 flex items-center justify-center border-none outline-none z-10",
              isFavorite
                ? "bg-primary text-white"
                : "bg-white/90 text-gray-400 hover:text-primary hover:bg-white"
            )}
            title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <IconHeart size={14} weight={isFavorite ? "fill" : "regular"} />
          </button>
        ) : null}

        {/* Desktop hover add-to-cart / go-to-cart strip */}
        {!ctaSlot && !stockOverlay && (
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden md:block">
            {isInCart ? (
              <Link
                href="/cart"
                className="w-full py-2 text-[11px] font-bold flex items-center justify-center gap-1.5 bg-green-600 text-white hover:brightness-110 transition-colors"
              >
                <IconCart size={13} weight="fill" />
                Go to Cart
              </Link>
            ) : onAddToCart ? (
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                className={cn(
                  "w-full py-2 text-[11px] font-bold border-none cursor-pointer transition-colors",
                  isAdded ? "bg-green-600 text-white" : "bg-primary text-white hover:brightness-110"
                )}
              >
                {isAdded ? "✓ Added!" : "+ Add to Cart"}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1">

        {(product.brand || product.meta) && (
          <p className="text-[9px] text-on-surface-variant font-semibold uppercase tracking-wider mb-0.5 truncate">
            {product.brand || product.meta}
          </p>
        )}

        <h4 className="text-xs font-medium text-on-surface mb-1.5 line-clamp-2 leading-snug min-h-[2.5rem]">
          <Link href={`/marketplace/${product._id ?? product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h4>

        {product.rating != null && (
          <div className="flex items-center gap-1 mb-1.5">
            <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
              {product.rating} ★
            </span>
            {product.reviewsCount != null && (
              <span className="text-[10px] text-on-surface-variant">
                ({product.reviewsCount >= 1000 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount})
              </span>
            )}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-end justify-between gap-1">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm font-bold text-on-surface">{fmt(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] text-on-surface-variant line-through">{fmt(product.mrp)}</span>
              )}
              {discount != null && discount > 0 && (
                <span className="text-[10px] font-bold text-green-600">{discount}% off</span>
              )}
            </div>
            {!ctaSlot && (
              isInCart ? (
                <Link
                  href="/cart"
                  className="shrink-0 md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white"
                  title="Go to Cart"
                >
                  <IconCart size={14} weight="fill" />
                </Link>
              ) : onAddToCart ? (
                <CartButton
                  onClick={() => onAddToCart(product)}
                  isAdded={isAdded}
                  variant="icon"
                  className="shrink-0 md:hidden"
                />
              ) : null
            )}
          </div>
          {ctaSlot && <div className="mt-2">{ctaSlot}</div>}
        </div>
      </div>
    </article>
  );
}
