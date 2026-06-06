"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconUser, IconReceipt, IconHeart, IconCalendar, IconLocation, IconMoney, IconBell } from "@/lib/icons";

const NAV_ITEMS = [
  { Icon: IconUser,     label: "My Profile",       href: "/profile"          },
  { Icon: IconReceipt,  label: "My Orders",        href: "/orders"           },
  { Icon: IconHeart,    label: "Wishlist",         href: "/wishlist"         },
  { Icon: IconCalendar, label: "Appointments",     href: "/appointments"     },
  { Icon: IconLocation, label: "Saved Addresses",  href: "/saved-addresses"  },
  { Icon: IconMoney,    label: "Payment Methods",  href: "/payment-methods"  },
  { Icon: IconBell,     label: "Notifications",    href: "/notifications"    },
];

export default function MobileAccountNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden flex overflow-x-auto gap-1.5 pb-1 mb-3 no-scrollbar">
      {NAV_ITEMS.map(({ Icon, label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary"
            )}
          >
            <Icon size={13} weight={isActive ? "fill" : "regular"} className="leading-none" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
