/**
 * UI primitives — import from here everywhere.
 *
 * import { Card, Button, Badge, FormField, SectionHeader } from "@/components/ui";
 * import { OrderStatusBadge, StockBadge, DiscountBadge } from "@/components/ui";
 */
export { default as Card }          from "./Card";
export { default as Button }        from "./Button";
export { default as Badge, OrderStatusBadge, StockBadge, DiscountBadge } from "./Badge";
export { default as FormField }     from "./FormField";
export { default as SectionHeader } from "./SectionHeader";

export type { ButtonVariant, ButtonSize } from "./Button";
export type { BadgeVariant }             from "./Badge";
