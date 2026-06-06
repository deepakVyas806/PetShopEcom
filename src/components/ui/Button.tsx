"use client";
/**
 * Button — all interactive button variants in one place.
 * Every button in the app should use one of these variants.
 */
import { cn } from "@/lib/utils";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize    = "sm" | "md";

interface BaseProps {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  className?: string;
  disabled?:  boolean;
  children:   React.ReactNode;
  fullWidth?: boolean;
  rounded?:   "full" | "lg" | "md";
}

type ButtonProps = BaseProps &
  ({ href?: undefined; onClick?: React.MouseEventHandler<HTMLButtonElement>; type?: "button" | "submit" | "reset" } |
   { href: string; onClick?: undefined; type?: undefined });

const BASE =
  "inline-flex items-center justify-center gap-1.5 font-semibold transition-all active:scale-95 cursor-pointer border-none outline-none select-none";

const VARIANT: Record<ButtonVariant, string> = {
  primary:   "bg-primary text-on-primary hover:shadow-md hover:brightness-105",
  secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
  ghost:     "bg-transparent text-on-surface-variant hover:text-primary hover:bg-primary/5",
  danger:    "bg-error text-white hover:bg-error/90 shadow-sm",
  outline:   "bg-transparent border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "text-[10px] px-3 py-1",
  md: "text-xs px-4 py-2",
};

const ROUNDED = {
  full: "rounded-full",
  lg:   "rounded-lg",
  md:   "rounded-md",
} as const;

export default function Button({
  variant  = "primary",
  size     = "md",
  className,
  disabled,
  children,
  fullWidth,
  rounded = "full",
  ...rest
}: ButtonProps) {
  const cls = cn(
    BASE,
    VARIANT[variant],
    SIZE[size],
    ROUNDED[rounded],
    fullWidth && "w-full",
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
    className
  );

  if ("href" in rest && rest.href) {
    return <Link href={rest.href} className={cls}>{children}</Link>;
  }

  const { onClick, type = "button" } = rest as { onClick?: React.MouseEventHandler<HTMLButtonElement>; type?: "button" | "submit" | "reset" };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
