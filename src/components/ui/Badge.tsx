"use client";
/**
 * Badge — status, category, discount, and stock badges.
 * All badge-like chips should use this. Replaces ~15 different ad-hoc implementations.
 */
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/enums";
import { IconCheckCircle } from "@/lib/icons";

export type BadgeVariant =
  | "primary"   // purple — category, selected
  | "secondary" // muted — default info
  | "success"   // green — delivered, in-stock
  | "warning"   // orange — low stock, pending
  | "error"     // red — cancelled, out-of-stock, discount
  | "info"      // blue/tertiary — in-transit
  | "ghost"     // surface — neutral
  | "outline";  // bordered, no fill

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;       // show animated dot on the left
  pill?: boolean;      // rounded-full (default) vs rounded-md
}

const VARIANT: Record<BadgeVariant, string> = {
  primary:   "bg-primary/10 text-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  success:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  error:     "bg-error/10 text-error",
  info:      "bg-tertiary/10 text-tertiary",
  ghost:     "bg-surface-container text-on-surface-variant",
  outline:   "border border-outline-variant text-on-surface-variant bg-transparent",
};

export default function Badge({
  children,
  variant = "ghost",
  className,
  dot,
  pill = true,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide",
        pill ? "rounded-full" : "rounded-md",
        VARIANT[variant],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />}
      {children}
    </span>
  );
}

/* ── Convenience: Order Status badge ────────────────────────────────────── */
const ORDER_VARIANT: Record<string, BadgeVariant> = {
  [OrderStatus.CONFIRMED]:    "ghost",
  [OrderStatus.SHIPPED]:      "primary",
  [OrderStatus.OUT_DELIVERY]: "info",
  [OrderStatus.DELIVERED]:    "success",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const variant = ORDER_VARIANT[status] ?? "ghost";
  const label =
    status === OrderStatus.SHIPPED      ? "In Transit"       :
    status === OrderStatus.OUT_DELIVERY ? "Out for Delivery" :
    status === OrderStatus.DELIVERED    ? "Delivered"        :
    status === OrderStatus.CONFIRMED    ? "Processing"       :
    status;
  return <Badge variant={variant}>{label}</Badge>;
}

/* ── Convenience: Stock Status badge ────────────────────────────────────── */
export function StockBadge({ inStock = true, lowStock = false }: { inStock?: boolean; lowStock?: boolean }) {
  if (!inStock) return <Badge variant="error">Out of Stock</Badge>;
  if (lowStock)  return <Badge variant="warning" dot>Low Stock</Badge>;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600">
      <IconCheckCircle size={10} weight="fill" className="leading-none" />
      In Stock
    </span>
  );
}

/* ── Convenience: Discount badge ────────────────────────────────────────── */
export function DiscountBadge({ pct }: { pct: number }) {
  return (
    <Badge variant="error" className="bg-error text-white">
      -{pct}%
    </Badge>
  );
}
