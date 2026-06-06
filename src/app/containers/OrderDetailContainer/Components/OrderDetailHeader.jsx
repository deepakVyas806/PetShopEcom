"use client";

import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import { IconDownload, IconShipping } from "@/lib/icons";

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
        <IconDownload size={14} weight="bold" />
        Invoice
      </button>
      <Link
        href={`/track-order/${order.id}`}
        className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:shadow-md hover:brightness-105 transition-all"
      >
        <IconShipping size={14} weight="bold" />
        Track
      </Link>
    </PageHeader>
  );
}
