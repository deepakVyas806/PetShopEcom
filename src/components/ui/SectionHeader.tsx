"use client";
/**
 * SectionHeader — consistent title + optional subtitle + optional right action.
 * Used inside cards, page sections, list headers.
 */
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title:      string;
  subtitle?:  string;
  icon?:      React.ReactNode; // Phosphor icon component, e.g. <IconCart size={16} />
  action?:    React.ReactNode;
  className?: string;
  size?:      "sm" | "md";
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className,
  size = "md",
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-primary leading-none">
              {icon}
            </span>
          )}
          <h2 className={cn("font-bold text-on-surface", size === "sm" ? "text-xs" : "text-sm")}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-[10px] text-on-surface-variant mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
