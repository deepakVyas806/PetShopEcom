"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconHome, IconBag, IconSearch, IconReceipt, IconUser } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { useNotificationCount } from "@/hooks/useNotificationCount";

type Tab = {
  label: string;
  Icon: React.ElementType;
  active: boolean;
  badge?: string | null;
  onPress: () => void;
};

export default function MobileFooter() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart }   = useStore();

  const cartCount  = cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
  const notifCount = useNotificationCount();

  const guard = (path: string) =>
    router.push(isAuthenticated ? path : `/signin?redirect=${encodeURIComponent(path)}`);

  const TABS: Tab[] = [
    {
      label:   "Home",
      Icon:    IconHome,
      active:  pathname === "/",
      onPress: () => router.push("/"),
    },
    {
      label:   "Explore",
      Icon:    IconSearch,
      active:  pathname.startsWith("/marketplace"),
      onPress: () => router.push("/marketplace"),
    },
    {
      label:   "Cart",
      Icon:    IconBag,
      active:  pathname === "/cart",
      badge:   cartCount > 0 ? (cartCount > 9 ? "9+" : String(cartCount)) : null,
      onPress: () => router.push("/cart"),
    },
    {
      label:   "Orders",
      Icon:    IconReceipt,
      active:  pathname.startsWith("/orders") || pathname.startsWith("/order-detail") || pathname.startsWith("/track-order"),
      onPress: () => guard("/orders"),
    },
    {
      label:   isAuthenticated ? "Profile" : "Sign In",
      Icon:    IconUser,
      active:  pathname === "/profile",
      onPress: () => guard("/profile"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/96 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-1px_0_0_rgba(0,0,0,0.04),0_-4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-stretch h-[58px]">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={tab.onPress}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative focus:outline-none bg-transparent border-none cursor-pointer group"
          >
            {/* Active top indicator */}
            {tab.active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-primary" />
            )}

            {/* Icon wrapper with pill bg when active */}
            <div className={cn(
              "relative flex items-center justify-center w-11 h-6 rounded-full transition-all duration-200",
              tab.active ? "bg-primary/10" : "group-hover:bg-surface-container"
            )}>
              <tab.Icon
                size={19}
                weight={tab.active ? "fill" : "regular"}
                className={cn(
                  "transition-colors duration-150",
                  tab.active ? "text-primary" : "text-on-surface-variant"
                )}
              />

              {/* Badge */}
              {tab.badge && (
                <span className="absolute -top-1.5 -right-1 min-w-[15px] h-[15px] px-[3px] bg-primary text-on-primary text-[8px] font-black rounded-full flex items-center justify-center leading-none ring-[1.5px] ring-surface">
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className={cn(
              "text-[9px] font-semibold leading-none tracking-wide transition-colors duration-150",
              tab.active ? "text-primary" : "text-on-surface-variant"
            )}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
