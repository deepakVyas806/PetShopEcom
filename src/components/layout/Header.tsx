"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LogOut, Shield, MapPin, Search, ShoppingCart,
  ChevronDown, Calendar, ClipboardList, Moon, Sun, Settings
} from "lucide-react";
import { siteConfig } from "@/config/site";
import BrandLogo from "../common/BrandLogo";
import UserAvatar from "../common/UserAvatar";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

const PROMOS = [
  { text: "🐾 Use code PETS20 for 20% off your first order", highlight: "PETS20" },
  { text: "🚚 Free delivery on all orders above ₹499 — Shop Now", highlight: "₹499" },
  { text: "⭐ New arrivals: Premium grooming kits for dogs & cats", highlight: null },
  { text: "🎁 Buy 2 get 1 free on all Drools products this week", highlight: null },
];

const PET_QUICK_LINKS = [
  { label: "🐕 Dogs",       href: "/marketplace?category=dogs" },
  { label: "🐱 Cats",       href: "/marketplace?category=cats" },
  { label: "🦜 Birds",      href: "/marketplace?category=birds" },
  { label: "🐠 Fish",       href: "/marketplace?category=fish" },
  { label: "🐹 Small Pets", href: "/marketplace?category=small_pets" },
];

function AnnouncementBanner() {
  const [idx,       setIdx]       = useState(0);
  const [visible,   setVisible]   = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx((p) => (p + 1) % PROMOS.length);
        setAnimating(false);
      }, 300);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const promo = PROMOS[idx];

  return (
    <div className="bg-primary text-white text-[11px] font-medium flex items-center justify-center gap-2 px-4 py-1.5 relative select-none">
      <span className={`transition-opacity duration-300 text-center ${animating ? "opacity-0" : "opacity-100"}`}>
        {promo.text}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0.5"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useStore();
  const { user: currentUser, isAuthenticated, logout } = useAuth();
  const userRole = currentUser?.role ?? "guest";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [darkTheme, setDarkTheme] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sync initial dark mode state
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkTheme(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    if (darkTheme) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkTheme(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/marketplace?query=${encodeURIComponent(searchVal.trim())}&category=${searchCategory}`);
    } else {
      router.push(`/marketplace?category=${searchCategory}`);
    }
  };

  // Navigation menus dynamically filtered based on role
  const navItems = siteConfig.navigation.filter((item: any) => {
    if (item.adminOnly && userRole !== "admin") return false;
    return true;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans select-none">

      {/* TIER 0: Announcement Banner */}
      <AnnouncementBanner />

      {/* TIER 1: Main Navigation Bar - Glassmorphism */}
      <div className="bg-surface/80 backdrop-blur-md text-on-surface py-2 px-4 flex items-center justify-between gap-4 h-[60px] md:h-[65px] border-b border-outline-variant/25 shadow-sm transition-all duration-300">
        
        {/* Left Section: Logo & Delivery Pin */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo Container */}
          <Link href="/" className="px-2 py-1.5 hover:bg-surface-container rounded-md transition-all flex items-center cursor-pointer">
            {/* The BrandLogo component will automatically adapt text color */}
            <BrandLogo className="text-on-surface" />
          </Link>

          {/* Delivery Location Pin (Desktop Only) */}
          <div className="hidden lg:flex flex-col text-left justify-center pl-1 pr-2 py-1 hover:bg-surface-container rounded-md cursor-pointer transition-all">
            <span className="text-[10px] text-on-surface-variant/75 leading-none pl-5">Deliver to</span>
            <div className="flex items-center gap-1 leading-none mt-0.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-bold text-on-surface tracking-wide">Mumbai 400001</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Big Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex flex-grow max-w-3xl items-center bg-surface-container border border-outline-variant/35 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-primary h-10 shadow-inner"
        >
          {/* Category Dropdown Selector */}
          <select 
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border-r border-outline-variant/25 text-xs px-4 rounded-l-full cursor-pointer outline-none h-full transition-colors leading-none"
          >
            <option value="all">All Departments</option>
            <option value="dogs">Dogs</option>
            <option value="cats">Cats</option>
            <option value="exotics">Exotics</option>
          </select>

          {/* Text Input Search Field */}
          <input 
            type="text"
            placeholder="Search Art Pet Shop..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="flex-grow px-3 text-sm text-on-surface border-none outline-none focus:ring-0 placeholder-on-surface-variant/50 bg-transparent h-full"
          />

          {/* Search Action Button */}
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary-hover text-on-primary h-full w-14 flex items-center justify-center cursor-pointer transition-colors rounded-r-full"
            aria-label="Search items"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </form>

        {/* Right Section: Accounts, Orders, Cart, Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Theme Switcher Widget */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-surface-container rounded-md text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
            title="Toggle theme (Light/Dark)"
          >
            {darkTheme ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          {/* Accounts & Lists Trigger (Desktop Group Hover) */}
          <div className="relative group hidden md:block">
            <div 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex flex-col text-left justify-center px-2 py-1 hover:bg-surface-container rounded-md cursor-pointer transition-all"
            >
              <span className="text-[10px] text-on-surface-variant/75 leading-none">
                Hello, {currentUser ? currentUser.name.split(" ")[0] : "Sign In"}
              </span>
              <div className="flex items-center gap-0.5 leading-none mt-0.5 font-sans">
                <span className="text-xs font-bold text-on-surface tracking-wide">Account & Lists</span>
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
              </div>
            </div>

            {/* Hover Menu Overlay */}
            <div className="absolute right-0 top-[38px] w-64 pt-2 hidden group-hover:block z-50">
              <div className="bg-surface-container-lowest text-on-surface rounded-lg shadow-2xl border border-outline-variant/35 p-4 text-left flex flex-col gap-3 font-sans">
                {currentUser ? (
                  <>
                    <div className="flex flex-col border-b border-outline-variant/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <UserAvatar avatar={currentUser.avatar} name={currentUser.name} size="w-8 h-8" textSize="text-sm" />
                        <div>
                          <h4 className="text-xs font-extrabold text-on-surface">{currentUser.name}</h4>
                          <p className="text-[10px] text-on-surface-variant">{currentUser.email}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 mt-2 w-fit px-2.5 py-0.5 rounded-full bg-primary-container/20 text-[9px] font-black uppercase text-primary border border-primary-container/30">
                        <Shield className="w-2.5 h-2.5" />
                        {userRole} Role
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs text-on-surface-variant font-medium">
                      <Link href="/checkout" className="hover:text-primary hover:underline flex items-center gap-1.5 py-1">
                        <ClipboardList className="w-3.5 h-3.5 text-on-surface-variant/60" />
                        Your Orders
                      </Link>
                      <Link href="/services/scheduler" className="hover:text-primary hover:underline flex items-center gap-1.5 py-1">
                        <Calendar className="w-3.5 h-3.5 text-on-surface-variant/60" />
                        Scheduled Bookings
                      </Link>
                      {userRole === "admin" && (
                        <Link href="/admin" className="hover:text-primary hover:underline flex items-center gap-1.5 py-1 text-[#ba1a1a] font-bold border-t border-outline-variant/20 pt-1.5">
                          <Settings className="w-3.5 h-3.5 text-error" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full mt-1.5 py-2 px-4 rounded-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-none"
                    >
                      <LogOut className="w-3.5 h-3.5 text-on-surface-variant" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="text-center py-2 flex flex-col gap-2.5">
                    <p className="text-xs text-on-surface-variant">Get the full shopping experience</p>
                    <Link
                      href="/signin"
                      className="w-full py-2.5 btn-primary text-xs uppercase text-center shadow-md border-none"
                    >
                      Sign In Securely
                    </Link>
                    <div className="text-[10px] text-on-surface-variant">
                      New customer? <Link href="/signin" className="text-primary hover:underline">Start here.</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Returns & Orders (Desktop Link) */}
          <Link 
            href="/checkout" 
            className="hidden md:flex flex-col text-left justify-center px-2 py-1 hover:bg-surface-container rounded-md transition-all cursor-pointer"
          >
            <span className="text-[10px] text-on-surface-variant/75 leading-none">Returns</span>
            <span className="text-xs font-bold text-on-surface tracking-wide leading-none mt-0.5">& Orders</span>
          </Link>

          {/* Cart Icon Link with numeric overlay (Desktop & Mobile) */}
          <Link 
            href="/checkout" 
            className="flex items-center gap-1.5 px-3 py-2 hover:bg-surface-container rounded-md text-on-surface transition-all cursor-pointer relative"
          >
            <div className="relative flex items-end">
              {/* Numeric badge over cart shape */}
              <span className="absolute -top-2 left-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary text-on-primary text-[10px] font-black px-1 ring-1 ring-surface">
                {cartCount}
              </span>
              <ShoppingCart className="w-5 h-5 text-on-surface shrink-0" />
            </div>
            <span className="hidden lg:inline text-xs font-bold text-on-surface tracking-wide self-end leading-none mb-0.5">
              Cart
            </span>
          </Link>

          {/* Mobile Hamburger Toggle (Small viewports) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-surface-container rounded-md cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row (Under Logo - Only on small viewports) */}
      <div className="md:hidden bg-surface px-3 pb-2.5 pt-0.5 border-b border-outline-variant/25">
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-surface-container border border-outline-variant/30 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary h-9 w-full">
          <input 
            type="text"
            placeholder="Search Art Pet Shop..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="flex-grow px-3 text-xs text-on-surface border-none outline-none focus:ring-0 placeholder-on-surface-variant/50 bg-transparent h-full"
          />
          <button 
            type="submit" 
            className="bg-primary text-on-primary h-full w-10 flex items-center justify-center cursor-pointer"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* TIER 2: Category / Pet Quick-Links Strip */}
      <div className="bg-surface-container-low/90 backdrop-blur-md text-on-surface-variant text-xs px-4 py-2 flex items-center justify-between gap-4 h-[40px] border-b border-outline-variant/20 shadow-sm">

        {/* Left: pet category quick links + nav */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
          {/* All hamburger */}
          <button className="flex items-center gap-1.5 font-bold text-on-surface hover:bg-surface-container px-2.5 py-1 rounded-full transition-all cursor-pointer border-none outline-none shrink-0">
            <Menu className="w-3.5 h-3.5" />
            <span className="text-[11px]">All</span>
          </button>

          <span className="text-outline-variant/40 mx-0.5">|</span>

          {/* Pet quick-links */}
          {PET_QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:bg-surface-container hover:text-on-surface text-on-surface-variant shrink-0"
            >
              {link.label}
            </Link>
          ))}

          <span className="text-outline-variant/40 mx-0.5">|</span>
          <Link href="/marketplace" className="text-[11px] font-bold text-orange-600 hover:bg-orange-50 px-2.5 py-1 rounded-full shrink-0 transition-all">
            ⚡ Today&apos;s Deals
          </Link>
        </div>

        {/* Right: promo code */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-primary whitespace-nowrap shrink-0">
          <span className="bg-primary/10 px-2 py-0.5 rounded font-black tracking-wider text-primary">VET20</span>
          <span className="text-on-surface-variant font-medium">— 20% off vet visits</span>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-surface border-b border-outline-variant/30 p-4 shadow-2xl flex flex-col gap-4 font-sans text-left max-h-[80vh] overflow-y-auto z-40 text-on-surface">
          
          {/* User Signin/Signout Profile Widget inside Drawer */}
          <div className="flex items-center gap-3 border-b border-outline-variant/25 pb-3">
            <UserAvatar avatar={currentUser?.avatar} name={currentUser?.name} size="w-10 h-10" textSize="text-lg" />
            <div className="flex-grow">
              <h4 className="text-sm font-bold text-on-surface">
                {currentUser ? `Hello, ${currentUser.name}` : "Hello, Welcome"}
              </h4>
              <p className="text-xs text-on-surface-variant">{currentUser ? currentUser.email : "Sign in to track orders"}</p>
            </div>
          </div>
 
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold px-3 py-2.5 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 transition-all text-on-surface"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="h-px bg-outline-variant/20 my-2" />
            
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 rounded btn-primary text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4 text-white" />
                Sign Out ({currentUser.name})
              </button>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded btn-primary text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center"
              >
                Sign In Securely
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
