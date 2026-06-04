"use client";

import PageHeader from "@/components/common/PageHeader";

export default function OrderHeader({ order }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",       href: "/"        },
        { label: "My Account", href: "/profile" },
        { label: "My Orders",  href: "/orders"  },
        { label: "Track Order"                  },
      ]}
      title="Track Your Order"
      subtitle={`#${order.id} · Placed on ${order.date}`}
    >
      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft flex-shrink-0" />
        {order.status}
      </div>
    </PageHeader>
  );
}
