"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconUser, IconReceipt, IconCalendar, IconHeart, IconLocation, IconMoney, IconBellActive, IconLogout } from "@/lib/icons";

const NAV_ITEMS = [
  { Icon: IconUser,        label: "My Profile",       href: "/profile",  fill: true  },
  { Icon: IconReceipt,     label: "Orders",           href: "/orders"                },
  { Icon: IconCalendar,    label: "Appointments",     href: "#"                      },
  { Icon: IconHeart,       label: "Wishlist",         href: "/wishlist"              },
  { Icon: IconLocation,    label: "Saved Addresses",  href: "#"                      },
  { Icon: IconMoney,       label: "Payment Methods",  href: "#"                      },
  { Icon: IconBellActive,  label: "Notifications",    href: "#"                      },
];

export default function ProfileSidebar({ logout }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-[calc(100vh-140px)] sticky top-24">
      <div className="flex flex-col bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 h-full shadow-sm">

        {/* Heading */}
        <div className="mb-6 px-2">
          <h2 className="text-sm font-bold text-primary">My Account</h2>
          <p className="text-xs text-on-surface-variant">Manage your pet profile</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ Icon, label, href, fill }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200 text-xs font-medium ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" weight={isActive && fill ? "fill" : "regular"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-outline-variant/30 pt-3 px-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-error hover:bg-error/5 transition-colors duration-200 text-sm font-medium cursor-pointer bg-transparent border-none"
          >
            <IconLogout size={18} weight="regular" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
