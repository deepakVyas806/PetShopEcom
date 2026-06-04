"use client";

import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";

export default function OrderDetailHeader({ order }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",       href: "/"        },
        { label: "My Account", href: "/profile" },
        { label: "My Orders",  href: "/orders"  },
        { label: `#${order.id}`                 },
      ]}
      title={`Order #${order.id}`}
      subtitle={`Placed on ${order.date} · ${order.time}`}
    >
      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft flex-shrink-0" />
        {order.statusLabel}
      </div>
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer bg-transparent">
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>download</span>
        Invoice
      </button>
      <Link
        href="/track-order"
        className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:shadow-md hover:brightness-105 transition-all"
      >
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>local_shipping</span>
        Track
      </Link>
    </PageHeader>
  );
}
