"use client";

import Link from "next/link";
import { IconGlobe, IconCamera, IconVideo, IconSend, IconShield } from "@/lib/icons";
import { useStore } from "@/context/StoreContext";
import BrandLogo from "@/components/common/BrandLogo";

export default function Footer() {
  const { userRole } = useStore();

  const adminLinks = [
    { label: "Admin Console Portal", href: "/admin" },
    { label: "Inventory Additions", href: "/admin" },
    { label: "Fulfillment Services", href: "/admin/fulfillment" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/marketplace" },
    { label: "Cart", href: "/cart" },
    { label: "Reviews", href: "/reviews" },
  ];

  const accountLinks = [
    { label: "Sign In", href: "/signin" },
    { label: "Sign Up", href: "/signup" },
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Profile", href: "/profile" },
  ];

  const linkCls =
    "text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block text-xs font-medium";

  return (
    <footer className="bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant/35 transition-colors duration-300">

      {/* Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-10 py-6 max-w-[1280px] mx-auto text-left">

        {/* Column 1: Brand + Socials */}
        <div className="space-y-2">
          <BrandLogo />
          <p className="text-on-surface-variant text-xs font-medium leading-relaxed">
            Redefining pet care through artful design and uncompromising quality.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href="https://artpetshop.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Official Website"
            >
              <IconGlobe size={16} weight="regular" />
            </a>
            <a
              href="https://instagram.com/artpetshop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <IconCamera size={16} weight="regular" />
            </a>
            <a
              href="https://youtube.com/@artpetshop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="YouTube"
            >
              <IconVideo size={16} weight="regular" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Quick Links</h5>
          <ul className="space-y-1.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkCls}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Account */}
        <div>
          <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Account</h5>
          <ul className="space-y-1.5">
            {accountLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkCls}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Newsletter</h5>
          <p className="text-on-surface-variant text-xs font-medium mb-3">
            Join our community for exclusive tips and offers.
          </p>
          <div className="flex gap-2">
            <input
              className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface placeholder:text-on-surface-variant/50"
              placeholder="Your email"
              type="email"
            />
            <button
              className="bg-primary text-on-primary p-2 rounded-lg hover:brightness-105 hover:shadow-brand-sm transition-all cursor-pointer"
              aria-label="Subscribe"
            >
              <IconSend size={16} weight="bold" />
            </button>
          </div>
        </div>

      </div>

      {/* Admin shortcuts */}
      {userRole === "admin" && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 pb-4">
          <div className="p-3 rounded-lg bg-primary-container/10 border border-primary/20 text-left max-w-lg mx-auto">
            <h4 className="text-[10px] font-black uppercase text-primary tracking-wider mb-2 flex items-center gap-1">
              <IconShield size={14} weight="bold" />
              <span>Admin Shortcuts</span>
            </h4>
            <div className="flex flex-wrap gap-4 text-xs">
              {adminLinks.map((al) => (
                <Link key={al.label} href={al.href} className="text-on-surface-variant hover:text-primary hover:underline font-medium">
                  {al.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment methods + trust strip */}
      <div className="border-t border-outline-variant/20 px-4 md:px-10 py-4 max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Payment icons */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-[10px] text-on-surface-variant font-medium shrink-0">We accept:</span>
            {["VISA", "MC", "UPI", "Paytm", "GPay", "COD"].map((p) => (
              <span
                key={p}
                className={`text-[9px] font-black px-2 py-0.5 rounded border border-outline-variant/40 select-none ${
                  p === "VISA"   ? "text-blue-700 bg-blue-50"    :
                  p === "MC"     ? "text-red-600 bg-red-50"       :
                  p === "UPI"    ? "text-green-700 bg-green-50"   :
                  p === "Paytm"  ? "text-sky-700 bg-sky-50"       :
                  p === "GPay"   ? "text-indigo-700 bg-indigo-50" :
                                   "text-gray-600 bg-gray-50"
                }`}
              >
                {p === "MC" ? "Mastercard" : p}
              </span>
            ))}
          </div>

          {/* Trust seals */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {[
              { icon: "🔒", label: "SSL Secured" },
              { icon: "✓",  label: "Verified Store" },
              { icon: "🛡", label: "100% Genuine" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1 text-[10px] text-on-surface-variant font-medium">
                <span className="text-xs">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright + legal */}
      <div className="px-4 md:px-10 py-3 border-t border-outline-variant/20 max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-on-surface-variant text-xs font-medium">
          &copy; {new Date().getFullYear()} artPetShop. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {["Privacy Policy", "Terms of Use", "Refund Policy", "Contact Us"].map((l) => (
            <Link key={l} href="#" className="text-[10px] text-on-surface-variant hover:text-primary transition-colors font-medium">
              {l}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  );
}
