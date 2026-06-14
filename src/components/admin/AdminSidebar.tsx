"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  IconChart, IconBag, IconCart, IconUser, IconCalendar,
  IconLogout, IconTag,
} from "@/lib/icons";
import UserAvatar from "@/components/common/UserAvatar";
import BrandLogo from "@/components/common/BrandLogo";

const NAV = [
  { label: "Dashboard",    href: "/admin",             icon: IconChart    },
  { label: "Orders",       href: "/admin/orders",       icon: IconCart     },
  { label: "Products",     href: "/admin/products",     icon: IconBag      },
  { label: "Services",     href: "/admin/services",     icon: IconCalendar },
  { label: "Customers",    href: "/admin/customers",    icon: IconUser     },
  { label: "Promotions",   href: "/admin/promotions",   icon: IconTag      },
  { label: "Appointments", href: "/admin/appointments", icon: IconCalendar },
  // { label: "Notifications", href: "/admin/notifications", icon: IconBell   },
  // { label: "Settings",      href: "/admin/settings",      icon: IconSliders },
];

interface Props {
  open:    boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-on-surface/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col w-60 shrink-0",
          "bg-surface-container-lowest border-r border-outline-variant/20",
          "transition-transform duration-300",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-outline-variant/20">
          <BrandLogo tagline="Admin Panel" />
        </div>

        {/* User chip */}
        {user && (
          <div className="px-3 py-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-surface-container-low">
              <UserAvatar avatar={user.avatar} name={user.name} size="w-8 h-8" textSize="text-base" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
                <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                )}
              >
                <Icon size={16} weight={isActive ? "fill" : "regular"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-3 border-t border-outline-variant/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-error hover:bg-error/5 transition-all cursor-pointer bg-transparent border-none"
          >
            <IconLogout size={16} weight="regular" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
