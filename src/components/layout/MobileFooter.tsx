"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MobileFooter() {
  const pathname = usePathname();
  const router   = useRouter();
  const { isAuthenticated } = useAuth();

  // Push to path — redirect to signin if unauthenticated
  const guardedPush = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      router.push(`/signin?redirect=${encodeURIComponent(path)}`);
    }
  };

  const tabs = [
    { label: "Home",  href: "/",           icon: <Home      className="w-5 h-5" />, guarded: false },
    { label: "Shop",  href: "/marketplace", icon: <ShoppingBag className="w-5 h-5" />, guarded: false },
    { label: "Book",  href: "/services/book", icon: <Calendar  className="w-5 h-5" />, guarded: false },
    { label: "Orders",href: "/orders",      icon: <Clock     className="w-5 h-5" />, guarded: true  },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-card/95 backdrop-blur-md border-t border-brand-foreground/5 shadow-2xl py-2 px-6 flex items-center justify-between">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const cls = `flex flex-col items-center gap-1 transition-all ${
          isActive ? "text-brand-primary font-black scale-105" : "text-brand-foreground/50 hover:text-brand-primary"
        }`;

        if (tab.guarded) {
          return (
            <button key={tab.label} onClick={() => guardedPush(tab.href)}
              className={`${cls} bg-transparent border-none cursor-pointer`}>
              {tab.icon}
              <span className="text-[9px] uppercase font-bold tracking-wider">{tab.label}</span>
            </button>
          );
        }

        return (
          <Link key={tab.label} href={tab.href} className={cls}>
            {tab.icon}
            <span className="text-[9px] uppercase font-bold tracking-wider">{tab.label}</span>
          </Link>
        );
      })}

      {/* Profile tab */}
      <button
        onClick={() => guardedPush("/profile")}
        className={`flex flex-col items-center gap-1 transition-all bg-transparent border-none cursor-pointer ${
          pathname === "/profile"
            ? "text-brand-primary font-black scale-105"
            : "text-brand-foreground/50 hover:text-brand-primary"
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center text-base leading-none">
          {isAuthenticated ? "🐾" : "👤"}
        </span>
        <span className="text-[9px] uppercase font-bold tracking-wider">
          {isAuthenticated ? "Me" : "Login"}
        </span>
      </button>
    </div>
  );
}
