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
        "rounded-2xl transition-shadow duration-200",
        surface
          ? "bg-surface-container-lowest border border-outline-variant/20"
          : "bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant/30",
        elevated ? "shadow-card-md" : "shadow-card-sm",
        PADDING[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
