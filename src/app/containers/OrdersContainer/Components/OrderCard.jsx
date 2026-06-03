"use client";

import Link from "next/link";
import OrderItemsList from "./OrderItemsList";
import { fmt } from "@/lib/currency";

// ─── Status display config ─────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Shipped: {
    label:    "In Transit",
    badgeCls: "bg-secondary-container/40 text-primary",
    iconBg:   "bg-primary-container/10",
    icon:     "local_shipping",
    iconCls:  "text-primary",
  },
  "Out for Delivery": {
    label:    "Out for Delivery",
    badgeCls: "bg-secondary-container/40 text-primary",
    iconBg:   "bg-primary-container/10",
    icon:     "near_me",
    iconCls:  "text-primary",
  },
  Delivered: {
    label:    "Delivered",
    badgeCls: "bg-green-50 text-green-700 border border-green-200",
    iconBg:   "bg-green-100",
    icon:     "check_circle",
    iconCls:  "text-green-600",
  },
  "Order Confirmed": {
    label:    "Processing",
    badgeCls: "bg-surface-container text-on-surface-variant",
    iconBg:   "bg-surface-variant",
    icon:     "pending",
    iconCls:  "text-on-surface-variant",
  },
};

const DEFAULT_STATUS = {
  label:    "Processing",
  badgeCls: "bg-surface-container text-on-surface-variant",
  iconBg:   "bg-surface-variant",
  icon:     "pending",
  iconCls:  "text-on-surface-variant",
};

// ─── Action buttons per status ────────────────────────────────────────────────
function getActions(status) {
  switch (status) {
    case "Shipped":
    case "Out for Delivery":
      return [
        { label: "Track Order",  variant: "primary",  href: "/track-order"                  },
        { label: "View Details", variant: "secondary", href: "/order-detail"                  },
        { label: "Invoice",      variant: "ghost",    icon: "download", align: "right"        },
      ];
    case "Delivered":
      return [
        { label: "Reorder",       variant: "primary"   },
        { label: "Rate Products", variant: "secondary", href: "/reviews" },
      ];
    case "Order Confirmed":
    default:
      return [
        { label: "View Details",  variant: "secondary", href: "/order-detail" },
        { label: "Cancel Order",  variant: "ghost-error"              },
      ];
  }
}

// ─── Action button renderer ───────────────────────────────────────────────────
function ActionButton({ action }) {
  const base = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer border-none flex items-center gap-1.5";

  const cls = {
    primary:      `${base} bg-primary text-on-primary hover:shadow-md`,
    secondary:    `${base} bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80`,
    ghost:        `${base} text-on-surface-variant hover:text-primary bg-transparent`,
    "ghost-error":`${base} text-error hover:text-error/80 bg-transparent`,
  }[action.variant] ?? base;

  const content = (
    <>
      {action.icon && (
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>
          {action.icon}
        </span>
      )}
      {action.label}
    </>
  );

  if (action.href) {
    return (
      <Link href={action.href} className={cls}>
        {content}
      </Link>
    );
  }
  return <button className={cls}>{content}</button>;
}

// ─── Order Card ────────────────────────────────────────────────────────────────
export default function OrderCard({ order, isExpanded, onToggleExpand }) {
  const cfg     = STATUS_CONFIG[order.status] ?? DEFAULT_STATUS;
  const actions = getActions(order.status);
  const hasItems = order.items.length > 0;

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/50 rounded-2xl transition-all duration-300 overflow-hidden ${
        order.status === "Order Confirmed" ? "opacity-80 hover:opacity-100" : ""
      }`}
      style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}
    >
      <div className="p-4">
        {/* ── Header row ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Left: icon + order info */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${cfg.iconBg}`}>
              <span className={`material-symbols-outlined ${cfg.iconCls}`} style={{ fontSize: 20 }}>
                {cfg.icon}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">#{order.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.badgeCls}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                Placed on {order.date}
              </p>
            </div>
          </div>

          {/* Right: total */}
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant">Total Amount</p>
            <p className="text-sm font-bold text-primary">{fmt(order.total)}</p>
          </div>
        </div>

        {/* ── Expand toggle ─────────────────────────────────────────── */}
        {hasItems && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-xs text-primary font-medium cursor-pointer bg-transparent border-none p-0 hover:underline"
          >
            <span
              className="material-symbols-outlined leading-none transition-transform duration-200"
              style={{ fontSize: 18, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              expand_more
            </span>
            View {order.items.length} Item{order.items.length > 1 ? "s" : ""}
          </button>
        )}

        {/* ── Expanded items ─────────────────────────────────────────── */}
        {isExpanded && hasItems && <OrderItemsList items={order.items} />}

        {/* ── Action buttons ─────────────────────────────────────────── */}
        <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center gap-2">
          {actions
            .filter((a) => a.align !== "right")
            .map((a) => <ActionButton key={a.label} action={a} />)
          }
          {/* Right-aligned ghost action (e.g. Invoice) */}
          {actions
            .filter((a) => a.align === "right")
            .map((a) => (
              <div key={a.label} className="ml-auto">
                <ActionButton action={a} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
