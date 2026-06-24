"use client";

import { useState } from "react";
import Link from "next/link";
import OrderItemsList from "./OrderItemsList";
import { fmt } from "@/lib/currency";
import { useStore } from "@/context/StoreContext";
import { OrderStatusBadge, Button } from "@/components/ui";
import { IconShipping, IconNavigate, IconCheckCircle, IconPending, IconDownload, IconReorder, IconRefresh, IconWarning, IconCancel, IconChevronDown } from "@/lib/icons";

// ─── Status icon config (kept for the icon display in header) ──────────────────
const STATUS_CONFIG = {
  Shipped: {
    iconBg:  "bg-primary-container/10",
    Icon:    IconShipping,
    iconCls: "text-primary",
  },
  "Out for Delivery": {
    iconBg:  "bg-primary-container/10",
    Icon:    IconNavigate,
    iconCls: "text-primary",
  },
  Delivered: {
    iconBg:  "bg-green-100",
    Icon:    IconCheckCircle,
    iconCls: "text-green-600",
  },
  "Order Confirmed": {
    iconBg:  "bg-surface-variant",
    Icon:    IconPending,
    iconCls: "text-on-surface-variant",
  },
};

const DEFAULT_STATUS = {
  iconBg:  "bg-surface-variant",
  Icon:    IconPending,
  iconCls: "text-on-surface-variant",
};

// ─── Order Card ────────────────────────────────────────────────────────────────
export default function OrderCard({ order, isExpanded, onToggleExpand }) {
  const { addToCart } = useStore();

  // Cancel state
  const [cancelStep, setCancelStep] = useState("idle"); // "idle" | "confirm" | "done"

  // Reorder state
  const [reorderStep, setReorderStep] = useState("idle"); // "idle" | "adding" | "done"

  const cfg      = STATUS_CONFIG[order.status] ?? DEFAULT_STATUS;
  const hasItems = order.items?.length > 0;
  const orderId  = order.orderId ?? order._id?.toString() ?? "—";
  const orderKey = order._id?.toString() ?? order.orderId;
  const placedOn = (() => {
    if (!order.createdAt) return "—";
    const d = new Date(order.createdAt);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  })();

  // ── Handle Reorder ────────────────────────────────────────────────────────
  const handleReorder = async () => {
    setReorderStep("adding");
    order.items.forEach((item) => addToCart(item.product));
    // brief artificial delay so the user sees the "Adding…" state
    await new Promise((r) => setTimeout(r, 700));
    setReorderStep("done");
    setTimeout(() => setReorderStep("idle"), 2000);
  };

  // ── Render action buttons for a given status ───────────────────────────────
  const renderActions = () => {
    switch (order.status) {
      case "Shipped":
      case "Out for Delivery":
        return (
          <>
            <Button href={`/track-order/${orderKey}`} variant="primary" size="md" rounded="lg">
              Track Order
            </Button>
            <Button href={`/order-detail/${orderKey}`} variant="secondary" size="md" rounded="lg">
              View Details
            </Button>
            <div className="ml-auto">
              <Button variant="ghost" size="md" rounded="lg">
                <IconDownload size={16} className="leading-none" weight="regular" />
                Invoice
              </Button>
            </div>
          </>
        );

      case "Delivered":
        return (
          <>
            {/* Reorder button with states */}
            <Button
              variant="primary"
              size="md"
              rounded="lg"
              onClick={reorderStep === "idle" ? handleReorder : undefined}
              disabled={reorderStep === "adding"}
              className={reorderStep === "adding" ? "opacity-70 cursor-wait" : ""}
            >
              {reorderStep === "idle" && (
                <>
                  <IconReorder size={14} className="leading-none" weight="regular" />
                  Reorder
                </>
              )}
              {reorderStep === "adding" && (
                <>
                  <IconRefresh size={14} className="leading-none animate-spin" weight="regular" />
                  Adding…
                </>
              )}
              {reorderStep === "done" && (
                <>
                  <IconCheckCircle size={14} className="leading-none" weight="regular" />
                  Added to Cart ✓
                </>
              )}
            </Button>
            <Button href="/reviews" variant="secondary" size="md" rounded="lg">
              Rate Products
            </Button>
          </>
        );

      case "Order Confirmed":
      default:
        return (
          <>
            <Button href={`/order-detail/${orderKey}`} variant="secondary" size="md" rounded="lg">
              View Details
            </Button>

            {/* Cancel — inline confirmation flow */}
            {cancelStep === "idle" && (
              <Button
                variant="danger"
                size="md"
                rounded="lg"
                onClick={() => setCancelStep("confirm")}
              >
                Cancel Order
              </Button>
            )}

            {cancelStep === "confirm" && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-error font-semibold flex items-center gap-1">
                  <IconWarning size={14} className="leading-none" weight="regular" />
                  Cancel this order?
                </span>
                <Button variant="danger" size="md" rounded="lg" onClick={() => setCancelStep("done")}>
                  Yes, Cancel
                </Button>
                <Button variant="secondary" size="md" rounded="lg" onClick={() => setCancelStep("idle")}>
                  Keep Order
                </Button>
              </div>
            )}

            {cancelStep === "done" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-bold">
                <IconCancel size={14} className="leading-none" weight="regular" />
                Order Cancelled
              </span>
            )}
          </>
        );
    }
  };

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/50 rounded-2xl transition-all duration-300 overflow-hidden ${
        order.status === "Order Confirmed" && cancelStep !== "done" ? "opacity-80 hover:opacity-100" : ""
      }`}
      style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}
    >
      <div className="p-4">
        {/* ── Header row ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Left: icon + order info */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${cfg.iconBg}`}>
              <cfg.Icon size={20} className={cfg.iconCls} weight="regular" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">#{orderId}</span>
                {cancelStep === "done"
                  ? <OrderStatusBadge status="Cancelled" />
                  : <OrderStatusBadge status={order.status} />
                }
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                Placed on {placedOn}
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
            <IconChevronDown size={18} className="leading-none transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} weight="regular" />
            View {order.items.length} Item{order.items.length > 1 ? "s" : ""}
          </button>
        )}

        {/* ── Expanded items ─────────────────────────────────────────── */}
        {isExpanded && hasItems && <OrderItemsList items={order.items} />}

        {/* ── Action buttons ─────────────────────────────────────────── */}
        <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center gap-2">
          {renderActions()}
        </div>
      </div>
    </div>
  );
}
