"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/common/ProductCard";
import { IconDelete, IconCalendar, IconCartSimple, IconCheck, IconBell } from "@/lib/icons";

/* ─── Badge config ───────────────────────────────────────────────────────────── */
function buildBadges(badge, stock) {
  const list = [];
  if (badge === "priceDrop") {
    list.push({ label: "Price Drop", cls: "bg-primary text-on-primary" });
    list.push({ label: "In Stock",   cls: "bg-green-100 text-green-700", dot: true, dotCls: "bg-green-600" });
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
      className="p-2 bg-white/80 backdrop-blur-sm hover:bg-red-50 text-error rounded-full transition-colors shadow-sm border-none cursor-pointer"
      aria-label="Remove from wishlist"
    >
      <IconDelete size={18} weight="regular" />
    </button>
  );
}

/* ─── Wishlist CTA button (goes into ctaSlot) ────────────────────────────────── */
function WishlistCTA({ item, isMoving, onMoveToCart }) {
  if (item.stock === "outOfStock") {
    return (
      <button
        disabled
        className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed border-none text-xs font-medium px-3"
      >
        Notify Me
      </button>
    );
  }
  if (item.itemType === "service") {
    return (
      <button className="p-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all border-none cursor-pointer flex items-center gap-1 text-xs font-medium px-3">
        <IconCalendar size={14} className="leading-none" weight="regular" />
        Book
      </button>
    );
  }
  return (
    <button
      onClick={onMoveToCart}
      disabled={isMoving}
      className={cn(
        "p-2 rounded-lg border-none cursor-pointer flex items-center gap-1 text-xs font-medium px-3 transition-all",
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

/* ─── Price Alert button ─────────────────────────────────────────────────────── */
function PriceAlertButton({ item }) {
  const [alertSet, setAlertSet] = useState(false);
  if (item.stock === "outOfStock" || item.itemType === "service") return null;
  return (
    <button
      onClick={() => setAlertSet((v) => !v)}
      className={cn(
        "flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5 transition-all cursor-pointer outline-none mt-1.5",
        alertSet
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary"
      )}
    >
      <IconBell size={10} weight={alertSet ? "fill" : "regular"} />
      {alertSet ? "Alert set ✓" : "Price alert"}
    </button>
  );
}

/* ─── WishlistCard ───────────────────────────────────────────────────────────── */
export default function WishlistCard({ item, isMoving, onRemove, onMoveToCart }) {
  // Map wishlist item to ProductCard's product format
  const product = {
    id:          item.id,
    name:        item.name,
    image:       item.image,
    price:       item.price,
    mrp:         item.originalPrice ?? undefined,
    meta:        `${item.category} · ${item.type}`,
  };

  return (
    <ProductCard
      product={product}
      badges={buildBadges(item.badge, item.stock)}
      stockOverlay={item.stock === "outOfStock"}
      isMoving={isMoving}
      topRightSlot={<DeleteButton onClick={onRemove} />}
      ctaSlot={
        <div>
          <WishlistCTA item={item} isMoving={isMoving} onMoveToCart={onMoveToCart} />
          <PriceAlertButton item={item} />
        </div>
      }
    />
  );
}
