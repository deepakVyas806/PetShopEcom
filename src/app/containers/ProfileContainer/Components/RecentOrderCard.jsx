"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";
import { Card, OrderStatusBadge, SectionHeader } from "@/components/ui";
import { IconPackage, IconChevronRight, IconReceipt } from "@/lib/icons";

const PAYMENT_LABEL = {
  cod:        "Cash on Delivery",
  card:       "Card",
  upi:        "UPI",
  netbanking: "Net Banking",
  wallet:     "Wallet",
  emi:        "EMI",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function RecentOrderCard({ order }) {
  return (
    <Card>
      <SectionHeader
        title="Recent Order"
        icon={<IconReceipt size={16} weight="regular" />}
        action={<Link href="/orders" className="text-[10px] text-primary font-semibold hover:underline">View All</Link>}
        className="mb-3"
      />

      {order ? (
        <>
          <Link
            href={`/orders/${order._id}`}
            className="flex items-start gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            {/* Thumbnail */}
            {order.items[0]?.image ? (
              <img
                src={order.items[0].image}
                alt={order.items[0].name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-outline-variant/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconPackage size={20} className="text-primary" weight="regular" />
              </div>
            )}

            {/* Main info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-on-surface truncate">
                {order.items[0]?.name || "Order Item"}
              </p>

              {order.items.length > 1 && (
                <p className="text-[10px] text-on-surface-variant">
                  +{order.items.length - 1} more item{order.items.length - 1 > 1 ? "s" : ""}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5">
                <span className="text-[10px] text-on-surface-variant font-medium">
                  #{order.orderId}
                </span>
                <span className="text-[10px] text-on-surface-variant">·</span>
                <span className="text-[10px] text-on-surface-variant">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-black text-on-surface">{fmt(order.total)}</span>
                {order.paymentMethod && (
                  <span className="text-[9px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full border border-outline-variant/20 font-medium">
                    {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                  </span>
                )}
              </div>
            </div>

            {/* Status + arrow */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <OrderStatusBadge status={order.status} />
              <IconChevronRight size={14} className="text-on-surface-variant group-hover:text-primary transition-colors" weight="regular" />
            </div>
          </Link>

          {/* Quick actions */}
          <div className="flex gap-2 mt-3">
            <Link
              href={`/track-order/${order._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              Track Order
            </Link>
            <Link
              href={`/orders/${order._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/8 text-xs font-semibold text-primary hover:bg-primary/15 transition-all"
            >
              View Details
            </Link>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-1.5">
          <IconPackage size={30} className="text-outline" weight="duotone" />
          <p className="text-xs text-on-surface-variant">No orders yet</p>
          <Link href="/marketplace" className="text-[10px] text-primary font-semibold hover:underline">Start Shopping</Link>
        </div>
      )}
    </Card>
  );
}
