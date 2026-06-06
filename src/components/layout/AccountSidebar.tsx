"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { IconUser, IconReceipt, IconHeart, IconCalendar, IconLocation, IconMoney, IconBell, IconLogout } from "@/lib/icons";

const NAV_ITEMS = [
  { Icon: IconUser,     label: "My Profile",       href: "/profile"          },
  { Icon: IconReceipt,  label: "My Orders",        href: "/orders"           },
  { Icon: IconHeart,    label: "Wishlist",         href: "/wishlist"         },
  { Icon: IconCalendar, label: "Appointments",     href: "/appointments"     },
  { Icon: IconLocation, label: "Saved Addresses",  href: "/saved-addresses"  },
  { Icon: IconMoney,    label: "Payment Methods",  href: "/payment-methods"  },
  { Icon: IconBell,     label: "Notifications",    href: "/notifications"    },
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
          {NAV_ITEMS.map(({ Icon, label, href }) => {
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
                <Icon size={16} weight={isActive ? "fill" : "regular"} className="flex-shrink-0 leading-none" />
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
            <IconLogout size={16} className="leading-none flex-shrink-0" weight="regular" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
