"use client";

/**
 * Shared add-to-cart button used everywhere in the project.
 *
 * Variants:
 *   "icon"  — icon-only square (used inside product cards)
 *   "pill"  — icon + label, rounded-full (used on detail pages, bundles, etc.)
 *
 * States:
 *   isAdded — shows a ✓ check + success colours for ~1.5 s after adding
 */

import { cn } from "@/lib/utils";
import { IconCartSimple, IconCheck } from "@/lib/icons";

/* ─── Colours ───────────────────────────────────────────────────────────────── */
const BASE_CLR  = "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary";
const ADDED_CLR = "bg-primary text-on-primary";

export default function CartButton({
  onClick,
  isAdded   = false,
  label     = "Add to Cart",
  variant   = "icon",   // "icon" | "pill"
  className = "",
  disabled  = false,
}) {
  const shared = cn(
    "transition-all duration-200 active:scale-95 cursor-pointer border-none outline-none",
    "flex items-center justify-center gap-1.5",
    "hover:shadow-md",
    isAdded ? ADDED_CLR : BASE_CLR,
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const iconSize = variant === "icon" ? 18 : 16;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={isAdded ? "Added!" : label}
      className={cn(
        shared,
        variant === "icon"
          ? "p-2 rounded-lg"
          : "px-4 py-2 rounded-full text-xs font-semibold"
      )}
    >
      {isAdded
        ? <IconCheck size={iconSize} weight="bold" className="leading-none flex-shrink-0" />
        : <IconCartSimple size={iconSize} weight="bold" className="leading-none flex-shrink-0" />
      }
      {variant === "pill" && (
        <span>{isAdded ? "Added!" : label}</span>
      )}
    </button>
  );
}
