"use client";
/**
 * Card — single glass-card style used across the entire app.
 * Replaces all ad-hoc bg-white/80 + backdrop-blur + border-[#F3E8FF] patterns.
 */
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  /** elevated adds a subtle shadow */
  elevated?: boolean;
  /** surface uses the darker surface variant instead of the white glass */
  surface?: boolean;
}

const PADDING = {
  none: "",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-5",
} as const;

export default function Card({
  children,
  className,
  padding  = "md",
  elevated = false,
  surface  = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        surface
          ? "bg-surface-container-lowest dark:bg-surface-container border border-outline-variant/20"
          : "bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20",
        elevated ? "shadow-md" : "shadow-sm",
        PADDING[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
