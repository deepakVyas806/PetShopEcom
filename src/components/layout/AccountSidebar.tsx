"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: "person",               label: "My Profile",       href: "/profile"  },
  { icon: "receipt_long",         label: "My Orders",        href: "/orders"   },
  { icon: "local_shipping",       label: "Track Order",      href: "/track-order" },
  { icon: "favorite",             label: "Wishlist",         href: "/wishlist" },
  { icon: "calendar_today",       label: "Appointments",     href: "/appointments" },
  { icon: "location_on",          label: "Saved Addresses",  href: "/saved-addresses" },
  { icon: "payments",             label: "Payment Methods",  href: "/payment-methods" },
  { icon: "notifications_active", label: "Notifications",    href: "/notifications" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:block w-44 shrink-0 sticky top-16 self-start">
      <div className="py-4 pr-2">

        {/* User chip */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-surface-container-low rounded-xl">
            <span className="text-base leading-none flex-shrink-0">{user.avatar}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{user.name.split(" ")[0]}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs font-medium",
                  isActive
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-0.5"
                )}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0 leading-none"
                  style={{
                    fontSize: 16,
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {icon}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-outline-variant/20 pt-2 mt-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-error/5 hover:translate-x-0.5 transition-all cursor-pointer bg-transparent border-none"
          >
            <span className="material-symbols-outlined leading-none flex-shrink-0" style={{ fontSize: 16 }}>
              logout
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
