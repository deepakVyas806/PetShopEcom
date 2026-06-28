"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { IconUser, IconReceipt, IconHeart, IconCalendar, IconLocation, IconMoney, IconBell, IconLogout } from "@/lib/icons";
import UserAvatar from "@/components/common/UserAvatar";

const NAV_ITEMS = [
  { Icon: IconUser,     label: "My Profile",       href: "/profile"          },
  { Icon: IconReceipt,  label: "My Orders",        href: "/orders",           matches: ["/orders", "/order-detail/", "/track-order/"] },
  { Icon: IconHeart,    label: "Wishlist",         href: "/wishlist"         },
  // { Icon: IconCalendar, label: "Appointments",     href: "/appointments"     },
  { Icon: IconLocation, label: "Saved Addresses",  href: "/saved-addresses"  },
  // { Icon: IconMoney,    label: "Payment Methods",  href: "/payment-methods"  },
  { Icon: IconBell,     label: "Notifications",    href: "/notifications"    },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:block w-48 shrink-0 sticky top-16 self-start">
      <div className="py-4 pr-2">

        {/* User chip */}
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-3 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card-sm">
            <UserAvatar avatar={user.avatar} name={user.name} size="w-8 h-8" textSize="text-base" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">{user.name.split(" ")[0]}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ Icon, label, href, matches }) => {
            const isActive = matches
            ? matches.some(p => pathname === p || pathname.startsWith(p))
            : pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs font-medium",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:translate-x-0.5"
                )}
              >
                <Icon size={15} weight={isActive ? "fill" : "regular"} className="flex-shrink-0 leading-none" />
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-primary flex-shrink-0" />
                )}
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
            <IconLogout size={15} className="leading-none flex-shrink-0" weight="regular" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
