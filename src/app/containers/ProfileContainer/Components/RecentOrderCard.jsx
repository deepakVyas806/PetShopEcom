"use client";

import Link from "next/link";

const glassCard = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 10px 25px -5px rgba(124,58,237,0.10)",
};

const STATUS_COLOR = {
  "Order Confirmed":  "bg-primary/10 text-primary",
  "Shipped":          "bg-tertiary/10 text-tertiary",
  "Out for Delivery": "bg-secondary/10 text-secondary",
  "Delivered":        "bg-green-100 text-green-700",
};

export default function RecentOrderCard({ order }) {
  return (
    <div className="rounded-xl p-6" style={glassCard}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-on-background">Recent Order</h2>
        <Link href="/orders" className="text-xs text-primary font-medium hover:underline">
          View All
        </Link>
      </div>

      {order ? (
        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
          {/* Thumbnail */}
          {order.items[0]?.product?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={order.items[0].product.image}
              alt={order.items[0].product.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 26 }}>package_2</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-on-background truncate">
              {order.items[0]?.product?.name || "Order Item"}
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              #{order.id} &bull; ${order.total?.toFixed(2)}
            </p>
          </div>

          {/* Status badge */}
          <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${STATUS_COLOR[order.trackingStatus] ?? "bg-surface-container text-on-surface-variant"}`}>
            {order.trackingStatus}
          </span>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <span className="material-symbols-outlined text-outline" style={{ fontSize: 36 }}>receipt_long</span>
          <p className="text-xs text-on-surface-variant">No orders yet</p>
          <Link href="/marketplace" className="text-xs text-primary font-semibold hover:underline">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
