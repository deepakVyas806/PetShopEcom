"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Calendar, User, Clock, ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function MobileFooter() {
  const pathname = usePathname();
  const { userRole, currentUser } = useStore();

  const tabs = [
    { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Shop", href: "/marketplace", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Book", href: "/services/book", icon: <Calendar className="w-5 h-5" /> },
    { label: "Schedule", href: "/services/scheduler", icon: <Clock className="w-5 h-5" /> },
  ];

  // Role based profile icon href
  const profileTab = currentUser
    ? userRole === "admin"
      ? { label: "Admin", href: "/admin", icon: <ShieldAlert className="w-5 h-5" /> }
      : { label: "Profile", href: "/signin", icon: <User className="w-5 h-5" /> }
    : { label: "Login", href: "/signin", icon: <User className="w-5 h-5" /> };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-card/95 backdrop-blur-md border-t border-brand-foreground/5 shadow-2xl py-2 px-6 flex items-center justify-between">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-brand-primary font-black scale-105" : "text-brand-foreground/50 hover:text-brand-primary"
            }`}
          >
            {tab.icon}
            <span className="text-[9px] uppercase font-bold tracking-wider">{tab.label}</span>
          </Link>
        );
      })}

      <Link
        href={profileTab.href}
        className={`flex flex-col items-center gap-1 transition-all ${
          pathname === profileTab.href
            ? "text-brand-primary font-black scale-105"
            : "text-brand-foreground/50 hover:text-brand-primary"
        }`}
      >
        {profileTab.icon}
        <span className="text-[9px] uppercase font-bold tracking-wider">{profileTab.label}</span>
      </Link>
    </div>
  );
}
