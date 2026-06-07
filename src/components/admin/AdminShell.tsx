"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { IconList } from "@/lib/icons";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/admin":              { title: "Dashboard",    subtitle: "Overview of store performance and activity."       },
  "/admin/orders":       { title: "Orders",        subtitle: "Manage and update all customer orders."           },
  "/admin/products":     { title: "Products",      subtitle: "Add, edit and manage your product catalogue."     },
  "/admin/services":     { title: "Services",      subtitle: "Manage grooming, vet and other services."         },
  "/admin/customers":    { title: "Customers",     subtitle: "View and manage customer accounts."               },
  "/admin/promotions":   { title: "Promotions",    subtitle: "Manage coupons, discounts, and seasonal campaigns." },
  "/admin/appointments": { title: "Appointments",  subtitle: "Track and manage service bookings."               },
  // "/admin/notifications": { title: "Notifications", subtitle: "Manage and send notifications to customers." },
  // "/admin/settings":      { title: "Settings",       subtitle: "Configure store settings and preferences."  },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Match longest prefix first so /admin/orders doesn't match /admin
  const meta = Object.entries(PAGE_META)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1]
    ?? { title: "Admin", subtitle: "" };

  void meta; // PAGE_META kept for future reference; each page renders its own PageHeader

  return (
    <div className="fixed inset-0 z-[100] bg-background flex">

      {/* Fixed sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-60">

        {/* Mobile hamburger toggle */}
        <div className="md:hidden px-4 pt-3 shrink-0">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer bg-transparent border-none"
          >
            <IconList size={20} weight="regular" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
