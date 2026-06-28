"use client";

/**
 * Auth-dependent header icons — loaded with ssr:false so the server
 * never renders them, eliminating any hydration mismatch.
 */

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { IconBell, IconHeart, IconUser, IconBag, IconLogout } from "@/lib/icons";
import UserAvatar from "@/components/common/UserAvatar";

function IconBtn({
  href, title, children,
}: { href?: string; title?: string; children: React.ReactNode }) {
  const base = cn(
    "w-9 h-9 flex items-center justify-center rounded-full",
    "hover:bg-primary/10 active:scale-95 transition-all duration-200 cursor-pointer"
  );
  if (href) return <Link href={href} className={base} title={title}>{children}</Link>;
  return <span className={base} title={title}>{children}</span>;
}

/* ── Mobile: just notification bell ──────────────────────────────────────── */
export function MobileAuthIcons() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <IconBtn href="/notifications" title="Notifications">
      <IconBell size={20} className="text-primary" weight="bold" />
    </IconBtn>
  );
}

/* ── Desktop: wishlist + notif + profile dropdown ────────────────────────── */
export function DesktopAuthIcons() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  if (!isAuthenticated) {
    return (
      <Link
        href="/signin"
        className="flex items-center gap-1.5 px-3 h-9 rounded-full bg-primary text-on-primary hover:shadow-brand-sm hover:brightness-105 active:scale-95 transition-all text-xs font-bold"
      >
        <IconUser size={16} weight="bold" />
        Sign In
      </Link>
    );
  }

  return (
    <>
      {/* Wishlist */}
      <IconBtn href="/wishlist" title="Wishlist">
        <IconHeart size={20} className="text-primary" weight="bold" />
      </IconBtn>

      {/* Notifications */}
      <IconBtn href="/notifications" title="Notifications">
        <IconBell size={20} className="text-primary" weight="bold" />
      </IconBtn>

      {/* Profile */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            "rounded-full ring-2 ring-primary/30 hover:ring-primary/60 active:scale-95 transition-all cursor-pointer border-none outline-none",
            menuOpen && "ring-primary/60"
          )}
          title={user?.name}
        >
          <UserAvatar avatar={user?.avatar} name={user?.name} size="w-9 h-9" textSize="text-base" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-surface rounded-2xl shadow-card-lg border border-outline-variant/20 overflow-hidden z-50">
            <div className="px-3 pt-3 pb-2">
              <p className="text-xs font-bold text-on-surface truncate">{user?.name}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{user?.email}</p>
            </div>
            <div className="px-1.5 pb-1.5 space-y-0.5">
              {[
                { label: "My Profile",    href: "/profile",       Icon: IconUser     },
                { label: "My Orders",     href: "/orders",        Icon: IconBag      },
                { label: "Wishlist",      href: "/wishlist",      Icon: IconHeart    },
                { label: "Notifications", href: "/notifications", Icon: IconBell     },
              ].map((item) => (
                <Link key={item.label} href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-container-low transition-colors text-xs text-on-surface font-medium"
                >
                  <item.Icon size={15} className="text-primary leading-none" weight="regular" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-outline-variant/20 pt-1 mt-1">
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-error/5 transition-colors text-xs text-error bg-transparent border-none cursor-pointer text-left font-medium"
                >
                  <IconLogout size={15} className="leading-none" weight="regular" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
