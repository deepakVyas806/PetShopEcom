"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconUser, IconReceipt, IconHeart, IconLocation, IconBell, IconLogout } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { Icon: IconUser,     label: "Profile",       href: "/profile"         },
  { Icon: IconReceipt,  label: "Orders",        href: "/orders",          matches: ["/orders", "/order-detail/", "/track-order/"] },
  { Icon: IconHeart,    label: "Wishlist",      href: "/wishlist"        },
  { Icon: IconLocation, label: "Addresses",     href: "/saved-addresses" },
  { Icon: IconBell,     label: "Notifications", href: "/notifications"   },
];

export default function MobileAccountNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="md:hidden sticky top-14 z-30 -mx-4 -mt-5 mb-4 bg-surface/96 backdrop-blur-md border-b border-outline-variant/20 shadow-sm grid grid-cols-3 divide-x divide-outline-variant/15">
      {NAV_ITEMS.map(({ Icon, label, href, matches }) => {
        const isActive = matches
          ? matches.some(p => pathname === p || pathname.startsWith(p))
          : pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2.5 transition-all active:scale-95 relative",
              isActive
                ? "bg-primary/8 text-primary"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-primary" />
            )}
            <Icon size={15} weight={isActive ? "fill" : "regular"} />
            <span className="text-[9px] font-semibold leading-none tracking-wide">{label}</span>
          </Link>
        );
      })}

      <button
        onClick={logout}
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-error hover:bg-error/5 transition-all active:scale-95 cursor-pointer"
      >
        <IconLogout size={15} weight="regular" />
        <span className="text-[9px] font-semibold leading-none tracking-wide">Sign Out</span>
      </button>
    </nav>
  );
}
