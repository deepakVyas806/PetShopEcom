"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";
import { Card, OrderStatusBadge, Button, SectionHeader } from "@/components/ui";
import { IconPackage, IconChevronRight, IconLocation, IconReorder, IconReceipt } from "@/lib/icons";

export default function RecentOrderCard({ order }) {
  return (
    <Card>
      {/* Header */}
      <SectionHeader
        title="Recent Order"
        icon={<IconReceipt size={16} weight="regular" />}
        action={<Link href="/orders" className="text-[10px] text-primary font-semibold hover:underline">View All</Link>}
        className="mb-3"
      />

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
              <IconPackage size={20} className="text-primary" weight="regular" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-on-surface truncate">{order.items[0]?.product?.name || "Order Item"}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">#{order.id} · {order.total != null ? fmt(order.total) : ""}</p>
          </div>

          {/* Status + arrow */}
          <div className="flex items-center gap-1 shrink-0">
            <OrderStatusBadge status={order.trackingStatus} />
            <IconChevronRight size={16} className="text-on-surface-variant" weight="regular" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-1.5">
          <IconPackage size={30} className="text-outline" weight="duotone" />
          <p className="text-xs text-on-surface-variant">No orders yet</p>
          <Link href="/marketplace" className="text-[10px] text-primary font-semibold hover:underline">Start Shopping</Link>
        </div>
      )}

      {/* Quick actions */}
      {order && (
        <div className="flex gap-2 mt-3">
          <Button href={`/track-order/${order.id}`} variant="ghost" size="sm" className="flex-1 py-1.5">
            <IconLocation size={12} weight="regular" />
            Track
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 py-1.5">
            <IconReorder size={12} weight="regular" />
            Reorder
          </Button>
        </div>
      )}
    </Card>
  );
}
