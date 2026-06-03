"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { icon: "dashboard",     label: "Dashboard",     href: "/"         },
  { icon: "receipt_long",  label: "Orders",         href: "/orders"   },
  { icon: "favorite",      label: "Wishlist",       href: "/wishlist"  },
  { icon: "notifications", label: "Subscriptions",  href: "#"          },
  { icon: "person",        label: "Profile",        href: "/profile"  },
];

export default function OrdersSidebar({ logout }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 space-y-0.5">
      <div className="px-2 mb-5">
        <h2 className="text-sm font-bold text-primary">Account Management</h2>
        <p className="text-xs text-on-surface-variant">Manage your pet's happiness</p>
      </div>

      {NAV.map(({ icon, label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mx-1 transition-all text-xs font-medium ${
              isActive
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-0.5"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
            {label}
          </Link>
        );
      })}

      <div className="border-t border-outline-variant/30 pt-3 mt-3 space-y-0.5">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl mx-1 text-on-surface-variant hover:bg-surface-container-high hover:translate-x-0.5 transition-all text-xs font-medium"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl mx-1 text-error hover:bg-error-container/20 hover:translate-x-0.5 transition-all text-xs font-medium cursor-pointer bg-transparent border-none"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
