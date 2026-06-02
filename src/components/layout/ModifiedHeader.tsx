"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import BrandLogo from "../common/BrandLogo";

export default function ModifiedHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Dogs", href: "/marketplace?category=dogs" },
    { label: "Cats", href: "/marketplace?category=cats" },
    { label: "Birds", href: "/marketplace?category=birds" },
    { label: "Fish", href: "/marketplace?category=fish" },
    { label: "Small Pets", href: "/marketplace?category=small_pets" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/marketplace");
    }
  };

  return (
    <header className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/30 dark:border-outline/20 shadow-sm docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto w-full z-50">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="hover:opacity-90 transition-opacity cursor-pointer"
          >
            <BrandLogo className="text-on-surface" />
          </Link>

          {/* Navigation Categories */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={
                    isActive
                      ? "font-body-base text-body-base text-primary dark:text-primary-fixed font-bold border-b-2 border-primary pb-1"
                      : "font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all duration-200"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search & Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Search bar inside header */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/50 focus-within:border-primary transition-colors">
            <button type="submit" className="bg-transparent border-none outline-none cursor-pointer flex items-center p-0">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            </button>
            <input 
              className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none text-on-surface placeholder-on-surface-variant/60" 
              placeholder="Search for treats, toys..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-primary/5 rounded-full transition-all duration-200 active:scale-95 bg-transparent border-none outline-none cursor-pointer"
              title="Favorites"
            >
              <span className="material-symbols-outlined text-primary">favorite</span>
            </button>
            
            <Link 
              href="/cart"
              className="p-2 hover:bg-primary/5 rounded-full transition-all duration-200 active:scale-95 relative flex items-center justify-center cursor-pointer text-primary"
              title="Shopping Cart"
            >
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              className="p-2 hover:bg-primary/5 rounded-full transition-all duration-200 active:scale-95 bg-transparent border-none outline-none cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-primary">notifications</span>
            </button>

            <Link 
              href="/signin"
              className="p-2 hover:bg-primary/5 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer text-primary"
              title="Profile"
            >
              <span className="material-symbols-outlined text-primary">person</span>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}

