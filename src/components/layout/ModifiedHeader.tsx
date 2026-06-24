"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import BrandLogo from "../common/BrandLogo";
import SearchBar from "../common/SearchBar";
import { IconCart, IconLocation, IconChevronDown } from "@/lib/icons";

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

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai",
  "Hyderabad", "Pune", "Kolkata", "Ahmedabad",
  "Jaipur", "Surat", "Lucknow", "Indore",
];

function LocationPicker() {
  const [city, setCity]         = useState("Mumbai");
  const [open, setOpen]         = useState(false);
  const ref                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
          "hover:bg-primary/8 border border-transparent",
          open ? "bg-primary/8 border-primary/20" : "text-on-surface-variant hover:text-primary"
        )}
      >
        <IconLocation size={14} weight="fill" className="text-primary flex-shrink-0" />
        <span className="max-w-[68px] truncate text-on-surface">{city}</span>
        <IconChevronDown
          size={11}
          weight="bold"
          className={cn("text-on-surface-variant transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl z-[60] py-2 min-w-[148px] overflow-hidden">
          <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-wide px-3 pb-1.5 pt-0.5">
            Deliver to
          </p>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2",
                c === city
                  ? "text-primary font-black bg-primary/6"
                  : "text-on-surface hover:bg-surface-container-low font-medium"
              )}
            >
              {c === city && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 inline-block" />
              )}
              {c !== city && <span className="w-1.5 flex-shrink-0" />}
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModifiedHeader() {
  const pathname = usePathname();
  const { cart } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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
      {mounted && cartCount > 0 && (
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

        {/* Divider */}
        <div className="h-6 w-px bg-outline-variant/40 mx-3 flex-shrink-0" />

        {/* Location picker */}
        {/* <LocationPicker /> */}

        {/* Search — fills all middle space */}
        <SearchBar
          placeholder="Search products, services, breeds…"
          className="flex-1 mx-3"
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
