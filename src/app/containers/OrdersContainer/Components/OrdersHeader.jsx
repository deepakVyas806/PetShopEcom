"use client";

import PageHeader from "@/components/common/PageHeader";
import { IconSearch } from "@/lib/icons";

export default function OrdersHeader({ searchQuery, onSearch }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",       href: "/"        },
        { label: "My Account", href: "/profile" },
        { label: "My Orders"                    },
      ]}
      title="My Orders"
      subtitle="Track and manage your purchases."
    >
      <div className="relative">
        <IconSearch size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" weight="regular" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search orders…"
          className="pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-full focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-xs text-on-surface placeholder:text-on-surface-variant/50 w-44"
        />
      </div>
    </PageHeader>
  );
}
