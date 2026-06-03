"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";

const GLASS = "bg-white/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl shadow-sm";

const STATUS_COLOR = {
  "Order Confirmed":  "bg-primary/10 text-primary",
  "Shipped":          "bg-tertiary/10 text-tertiary",
  "Out for Delivery": "bg-secondary/10 text-secondary",
  "Delivered":        "bg-green-100 text-green-700",
};

export default function RecentOrderCard({ order }) {
  return (
    <div className={`${GLASS} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">receipt_long</span>
          <h2 className="text-xs font-bold text-on-surface">Recent Order</h2>
        </div>
        <Link href="/orders" className="text-[10px] text-primary font-semibold hover:underline">View All</Link>
      </div>

      {order ? (
        <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
          {/* Thumbnail */}
          {order.items[0]?.product?.image ? (
            <img
              src={order.items[0].product.image}
              alt={order.items[0].product.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">package_2</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-on-surface truncate">{order.items[0]?.product?.name || "Order Item"}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">#{order.id} · {order.total != null ? fmt(order.total) : ""}</p>
          </div>

          {/* Status + arrow */}
          <div className="flex items-center gap-1 shrink-0">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.trackingStatus] ?? "bg-surface-container text-on-surface-variant"}`}>
              {order.trackingStatus}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-1.5">
          <span className="material-symbols-outlined text-outline text-3xl">receipt_long</span>
          <p className="text-xs text-on-surface-variant">No orders yet</p>
          <Link href="/marketplace" className="text-[10px] text-primary font-semibold hover:underline">Start Shopping</Link>
        </div>
      )}

      {/* Quick actions */}
      {order && (
        <div className="flex gap-2 mt-3">
          <Link href="/track-order" className="flex-1 py-1.5 bg-primary/5 border border-primary/20 rounded-lg text-[10px] font-semibold text-primary flex items-center justify-center gap-1 hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined text-xs">location_on</span>
            Track
          </Link>
          <button className="flex-1 py-1.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-[10px] font-semibold text-on-surface-variant flex items-center justify-center gap-1 hover:bg-surface-container-high transition-all cursor-pointer border-0 outline-none">
            <span className="material-symbols-outlined text-xs">replay</span>
            Reorder
          </button>
        </div>
      )}
    </div>
  );
}
