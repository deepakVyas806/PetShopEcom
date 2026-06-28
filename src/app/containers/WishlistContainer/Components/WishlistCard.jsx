"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/common/ProductCard";
import { useStore } from "@/context/StoreContext";
import { IconDelete, IconCalendar, IconCartSimple, IconCheck } from "@/lib/icons";

/* ─── Badge config ───────────────────────────────────────────────────────────── */
function buildBadges(badge, stock) {
  const list = [];
  if (badge === "priceDrop") {
    list.push({ label: "Price Drop", cls: "bg-primary text-on-primary" });
    list.push({ label: "In Stock",   cls: "bg-success/10 text-success", dot: true, dotCls: "bg-success" });
  }
  if (badge === "service")  list.push({ label: "Service", cls: "bg-primary-container text-on-primary" });
  if (stock === "lowStock" && badge !== "priceDrop") {
    list.push({ label: "Low Stock", cls: "bg-orange-100 text-orange-700", dot: true, dotCls: "bg-orange-600 animate-pulse" });
  }
  return list;
}

/* ─── Wishlist-specific delete button (goes into topRightSlot) ───────────────── */
function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-error/10 text-error rounded-full transition-colors shadow-card-sm border-none cursor-pointer"
      aria-label="Remove from wishlist"
    >
      <IconDelete size={18} weight="regular" />
    </button>
  );
}

/* ─── Wishlist CTA button (goes into ctaSlot) ────────────────────────────────── */
function WishlistCTA({ item, isMoving, onMoveToCart }) {
  const { cart } = useStore();
  const isInCart = cart.some(i => (i.product._id ?? i.product.id) === item.id);

  if (item.stock === "outOfStock") {
    return (
      <button
        disabled
        className="w-full py-2 rounded-xl bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed border-none text-xs font-medium flex items-center justify-center"
      >
        Out of Stock
      </button>
    );
  }
  if (item.itemType === "service") {
    return (
      <Link
        href={`/services/book?serviceId=${item.id}`}
        className="w-full py-2 rounded-xl bg-primary text-on-primary hover:brightness-105 transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
      >
        <IconCalendar size={14} className="leading-none" weight="regular" />
        Book Now
      </Link>
    );
  }
  if (isInCart) {
    return (
      <Link
        href="/cart"
        className="w-full py-2 rounded-xl bg-success text-white flex items-center justify-center gap-1.5 text-xs font-bold hover:brightness-110 transition-all"
      >
        <IconCartSimple size={14} weight="bold" />
        Go to Cart
      </Link>
    );
  }
  return (
    <button
      onClick={onMoveToCart}
      disabled={isMoving}
      className={cn(
        "w-full py-2 rounded-xl border-none cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold transition-all",
        isMoving
          ? "bg-primary text-on-primary"
          : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
      )}
    >
      {isMoving ? <IconCheck size={14} weight="bold" /> : <IconCartSimple size={14} weight="bold" />}
      {isMoving ? "Added!" : "Move to Cart"}
    </button>
  );
}

/* ─── WishlistCard ───────────────────────────────────────────────────────────── */
export default function WishlistCard({ item, isMoving, onRemove, onMoveToCart }) {
  // Map wishlist item to ProductCard's product format
  const product = {
    id:           item.id,
    name:         item.name,
    image:        item.image,
    price:        item.price,
    mrp:          item.originalPrice ?? undefined,
    meta:         `${item.category} · ${item.type}`,
    description:  item.description ?? undefined,
    rating:       item.rating ?? undefined,
    reviewsCount: item.reviewsCount ?? undefined,
  };

  return (
    <ProductCard
      product={product}
      badges={buildBadges(item.badge, item.stock)}
      stockOverlay={item.stock === "outOfStock"}
      isMoving={isMoving}
      topRightSlot={<DeleteButton onClick={onRemove} />}
      ctaSlot={<WishlistCTA item={item} isMoving={isMoving} onMoveToCart={onMoveToCart} />}
    />
  );
}
