"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import BrandLogo from "../common/BrandLogo";

/* ─── Shared icon-button circle ─────────────────────────────────────────────── */
function IconBtn({
  onClick, href, title, children, className = "",
}: {
  onClick?: () => void; href?: string; title?: string;
  children: React.ReactNode; className?: string;
}) {
  const base = cn(
    "w-9 h-9 flex items-center justify-center rounded-full",
    "hover:bg-primary/10 active:scale-95 transition-all duration-200 cursor-pointer",
    className
  );
  if (href) return <Link href={href} className={base} title={title}>{children}</Link>;
  return (
    <button onClick={onClick} className={cn(base, "bg-transparent border-none outline-none")} title={title}>
      {children}
    </button>
  );
}

export default function ModifiedHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const { cart }  = useStore();
  const { isAuthenticated, user, logout } = useAuth();

  const [searchQuery,  setSearchQuery]  = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Shop",      href: "/marketplace",    guarded: false },
    { label: "Services",  href: "/services",        guarded: false },
    { label: "My Orders", href: "/orders",          guarded: true  },
  ];

  /* Close user dropdown on outside click */
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [userMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      searchQuery.trim()
        ? `/marketplace?query=${encodeURIComponent(searchQuery.trim())}`
        : "/marketplace"
    );
  };

  /* Redirect to /signin if page requires auth */
  const guardedPush = (path: string) => {
    if (isAuthenticated) router.push(path);
    else router.push(`/signin?redirect=${encodeURIComponent(path)}`);
  };

  /* Is a nav link "active" — loose match for sub-routes */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <header className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm top-0 sticky z-50">
      <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto w-full gap-4">

        {/* ── Brand logo ──────────────────────────────────────────── */}
        <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <BrandLogo className="text-on-surface" />
        </Link>

        {/* ── Main nav ────────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ label, href, guarded }) => {
            const active = isActive(href);

            // Shared classes for both Link and button
            const itemCls = cn(
              // base
              "relative px-3 py-1 rounded-full text-xs font-semibold",
              "transition-all duration-200 ease-out select-none",
              "active:scale-95",
              // state
              active
                ? "bg-primary text-on-primary shadow-sm"
                : [
                    "text-on-surface-variant",
                    "hover:bg-primary/10 hover:text-primary",
                    "hover:scale-105",
                  ]
            );

            return guarded ? (
              <button
                key={label}
                onClick={() => guardedPush(href)}
                className={cn(itemCls, "cursor-pointer border-none outline-none", !active && "bg-transparent")}
              >
                {label}
              </button>
            ) : (
              <Link key={label} href={href} className={itemCls}>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: search + icon row ────────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/50 focus-within:border-primary transition-colors gap-1"
          >
            <button type="submit" className="bg-transparent border-none outline-none cursor-pointer flex items-center p-0">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
            </button>
            <input
              className="bg-transparent border-none focus:ring-0 text-xs w-36 outline-none text-on-surface placeholder:text-on-surface-variant/50"
              placeholder="Search for treats, toys…"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Wishlist */}
          <IconBtn onClick={() => guardedPush("/wishlist")} title="Wishlist">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>favorite</span>
          </IconBtn>

          {/* Cart */}
          <div className="relative">
            <IconBtn href="/cart" title="Shopping Cart">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>shopping_cart</span>
            </IconBtn>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[9px] min-w-[14px] h-3.5 flex items-center justify-center rounded-full font-bold px-0.5 pointer-events-none">
                {cartCount}
              </span>
            )}
          </div>

          {/* Notifications */}
          <IconBtn href="/notifications" title="Notifications">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>notifications</span>
          </IconBtn>

          {/* Profile / auth */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>

              {/* Avatar circle — no text, no chevron */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-lg leading-none select-none",
                  "ring-2 ring-primary/30 hover:ring-primary/60 active:scale-95 transition-all cursor-pointer",
                  "bg-primary/10 border-none outline-none",
                  userMenuOpen && "ring-primary/60 bg-primary/15"
                )}
                title={user?.name}
              >
                {user?.avatar}
              </button>

              {/* Compact dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-surface rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden z-50">

                  {/* User info — tight */}
                  <div className="px-3 pt-3 pb-2">
                    <p className="text-xs font-bold text-on-surface truncate">{user?.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{user?.email}</p>
                  </div>

                  {/* Nav links — rounded pill style */}
                  <div className="px-1.5 pb-1.5 space-y-0.5">
                    {[
                      { label: "My Profile",    href: "/profile",       icon: "person"        },
                      { label: "My Orders",     href: "/orders",        icon: "shopping_bag"  },
                      { label: "Wishlist",      href: "/wishlist",      icon: "favorite"      },
                      { label: "Notifications", href: "/notifications", icon: "notifications" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-container-low transition-colors text-xs text-on-surface font-medium"
                      >
                        <span className="material-symbols-outlined text-primary leading-none" style={{ fontSize: 15 }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    ))}

                    {/* Divider + logout */}
                    <div className="border-t border-outline-variant/20 pt-1 mt-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-error/5 transition-colors text-xs text-error bg-transparent border-none cursor-pointer text-left font-medium"
                      >
                        <span className="material-symbols-outlined leading-none" style={{ fontSize: 15 }}>logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-1.5 px-3 h-9 rounded-full bg-primary text-on-primary hover:shadow-md hover:brightness-105 active:scale-95 transition-all text-xs font-bold"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
              <span className="hidden md:block">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
