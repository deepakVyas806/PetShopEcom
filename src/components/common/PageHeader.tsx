"use client";

import Link from "next/link";
import React from "react";
import { IconChevronRight } from "@/lib/icons";

interface Crumb {
  label: string;
  href?: string;
}

interface Action {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  /** Breadcrumb trail — last item should have no href (it's the current page) */
  breadcrumbs?: Crumb[];
  title: string;
  subtitle?: string;
  /** Primary CTA button on the right */
  action?: Action;
  /** Extra controls placed to the left of action (search box, filters, etc.) */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Shared page header used across every account/detail page.
 * Renders: optional breadcrumb → title → optional subtitle → optional action button.
 */
export default function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  action,
  children,
  className = "",
}: PageHeaderProps) {
  const ActionEl = action ? (
    action.href ? (
      <Link
        href={action.href}
        className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-semibold hover:shadow-lg hover:brightness-105 active:scale-95 transition-all"
      >
        {action.icon && <CircleIcon icon={action.icon} />}
        {action.label}
      </Link>
    ) : (
      <button
        onClick={action.onClick}
        className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-semibold hover:shadow-lg hover:brightness-105 active:scale-95 transition-all border-none cursor-pointer"
      >
        {action.icon && <CircleIcon icon={action.icon} />}
        {action.label}
      </button>
    )
  ) : null;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 ${className}`}>
      {/* Left: breadcrumb + title + subtitle */}
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center flex-wrap gap-1 text-xs text-on-surface-variant mb-1">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <IconChevronRight size={14} className="leading-none text-outline-variant" weight="regular" />
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-base font-extrabold text-on-surface tracking-tight">{title}</h1>

        {subtitle && (
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-md">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: extra children + primary action */}
      {(children || ActionEl) && (
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {children}
          {ActionEl}
        </div>
      )}
    </div>
  );
}

/* ─── Internal: circular icon wrapper for action button ─────────────────────── */
function CircleIcon({ icon }: { icon: string }) {
  // Display a simple "+" for common "add" actions, otherwise nothing
  const label = icon === "add" || icon.startsWith("add_") ? "+" : null;
  if (!label) return null;
  return (
    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold leading-none">
      {label}
    </span>
  );
}
