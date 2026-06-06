"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import BrandLogo from "../common/BrandLogo";
import SearchBar from "../common/SearchBar";
import { IconCart } from "@/lib/icons";

/* Auth-dependent icons loaded without SSR — eliminates hydration mismatch */
const MobileAuthIcons  = dynamic(
  () => import("./HeaderAuthSection").then((m) => m.MobileAuthIcons),
  { ssr: false }
);
const DesktopAuthIcons = dynamic(
  () => import("./HeaderAuthSection").then((m) => m.DesktopAuthIcons),
  { ssr: false }
);


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
  const { cart } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Shop",      href: "/marketplace", guarded: false },
    { label: "Services",  href: "/services",    guarded: false },
    { label: "My Orders", href: "/orders",      guarded: true  },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  const CartIcon = () => (
    <div className="relative">
      <IconBtn href="/cart" title="Cart">
        <IconCart size={20} className="text-primary" weight="bold" />
      </IconBtn>
      {cartCount > 0 && (
        <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[9px] min-w-[14px] h-3.5 flex items-center justify-center rounded-full font-bold px-0.5 pointer-events-none">
          {cartCount}
        </span>
      )}
    </div>
  );


  return (
    <header className="bg-surface/90 dark:bg-surface-container/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm top-0 sticky z-50">

      {/* ══ MOBILE ══════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden items-center h-14 px-3 gap-2 max-w-container-max mx-auto w-full">
        <Link href="/" className="flex-shrink-0">
          <BrandLogo showText={false} />
        </Link>

        <SearchBar
          placeholder="Search products & services…"
          className="flex-1"
        />

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <CartIcon />
          {/* Loaded without SSR — no hydration mismatch */}
          <MobileAuthIcons />
        </div>
      </div>

      {/* ══ DESKTOP ════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center h-16 px-margin-desktop max-w-container-max mx-auto w-full gap-0">

        {/* Brand */}
        <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <BrandLogo className="text-on-surface" />
        </Link>

        {/* Search — fills all middle space */}
        <SearchBar
          placeholder="Search products, services, breeds…"
          className="flex-1 mx-4"
        />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-shrink-0">
          {navLinks.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "relative px-3 py-1 rounded-full text-xs font-semibold",
                  "transition-all duration-200 ease-out select-none active:scale-95",
                  active
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-primary/10 hover:text-primary hover:scale-105"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Icons + Profile — loaded without SSR */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <CartIcon />
          <DesktopAuthIcons />
        </div>
      </div>
    </header>
  );
}
