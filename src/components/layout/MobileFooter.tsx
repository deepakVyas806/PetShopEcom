"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconHome, IconBag, IconLightning, IconClock, IconSearch } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

export default function MobileFooter() {
  const pathname = usePathname();
  const router   = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart } = useStore();
  const cartCount = cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);

  const guardedPush = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      router.push(`/signin?redirect=${encodeURIComponent(path)}`);
    }
  };

  const tabs = [
    { label: "Home",   href: "/",            icon: IconHome,      guarded: false },
    { label: "Search", href: "/marketplace",  icon: IconSearch,    guarded: false },
    { label: "Offers", href: "/marketplace",  icon: IconLightning, guarded: false, highlight: true },
    { label: "Orders", href: "/orders",       icon: IconClock,     guarded: true  },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-surface-container-lowest backdrop-blur-md border-t border-outline-variant/20 shadow-[0_-4px_16px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-around h-16 px-2">

        {tabs.map((tab) => {
          const isActive = pathname === tab.href && !tab.highlight;
          const Icon = tab.icon;

          const inner = (
            <div className={`flex flex-col items-center gap-0.5 relative px-3 py-1 rounded-xl transition-all ${
              isActive ? "text-primary" : tab.highlight ? "text-white" : "text-on-surface-variant"
            } ${tab.highlight ? "" : isActive ? "bg-primary/8" : ""}`}>
              {tab.highlight ? (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 -mt-5">
                    <Icon size={18} weight="fill" className="text-white" />
                  </div>
                </div>
              ) : (
                <Icon size={22} weight={isActive ? "fill" : "regular"} />
              )}
              <span className={`text-[9px] font-bold tracking-wide ${tab.highlight ? "text-primary -mt-1" : ""}`}>
                {tab.label}
              </span>
              {isActive && !tab.highlight && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          );

          if (tab.guarded) {
            return (
              <button key={tab.label} onClick={() => guardedPush(tab.href)}
                className="bg-transparent border-none cursor-pointer -mt-0.5 focus:outline-none">
                {inner}
              </button>
            );
          }

          return (
            <Link key={tab.label} href={tab.href} className="-mt-0.5">
              {inner}
            </Link>
          );
        })}

        {/* Shop tab with cart badge */}
        <button
          onClick={() => router.push("/cart")}
          className="bg-transparent border-none cursor-pointer -mt-0.5 focus:outline-none"
        >
          <div className={`flex flex-col items-center gap-0.5 relative px-3 py-1 rounded-xl transition-all ${
            pathname === "/cart" ? "text-primary bg-primary/8" : "text-on-surface-variant"
          }`}>
            <div className="relative">
              <IconBag size={22} weight={pathname === "/cart" ? "fill" : "regular"} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold tracking-wide">Cart</span>
            {pathname === "/cart" && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </div>
        </button>

        {/* Profile / login */}
        <button
          onClick={() => guardedPush("/profile")}
          className={`bg-transparent border-none cursor-pointer -mt-0.5 focus:outline-none`}
        >
          <div className={`flex flex-col items-center gap-0.5 relative px-3 py-1 rounded-xl transition-all ${
            pathname === "/profile" ? "text-primary bg-primary/8" : "text-on-surface-variant"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm leading-none ${
              pathname === "/profile" ? "ring-2 ring-primary ring-offset-1" : ""
            }`}>
              {isAuthenticated ? "🐾" : "👤"}
            </div>
            <span className="text-[9px] font-bold tracking-wide">
              {isAuthenticated ? "Me" : "Login"}
            </span>
            {pathname === "/profile" && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </div>
        </button>

      </div>
    </nav>
  );
}
