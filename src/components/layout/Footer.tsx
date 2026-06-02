"use client";

import React from "react";
import Link from "next/link";
import { Globe, Camera, Video, Send, ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { userRole } = useStore();

  const adminLinks = [
    { label: "Admin Console Portal", href: "/admin" },
    { label: "Inventory Additions", href: "/admin" },
    { label: "Fulfillment Services", href: "/admin/fulfillment" }
  ];

  return (
    <footer className="bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant/35 transition-colors duration-300">
      
      {/* Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-10 py-12 max-w-[1280px] mx-auto text-left">
        
        {/* Column 1: Info and Socials */}
        <div className="space-y-4">
          <div className="font-headline-sm text-headline-sm text-primary font-bold">artPetShop</div>
          <p className="text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
            Redefining pet care through artful design and uncompromising quality. Because they deserve the best.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Website">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Camera Feed">
              <Camera className="w-5 h-5" />
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Video Channel">
              <Video className="w-5 h-5" />
            </a>
          </div>
        </div>


        {/* Column 2: Quick Links */}
        <div>
          <h5 className="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider font-bold">Quick Links</h5>
          <ul className="space-y-3 text-body-sm">
            <li>
              <Link 
                href="/checkout" 
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-body-sm text-body-sm"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link 
                href="/services/scheduler" 
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-body-sm text-body-sm"
              >
                Appointments
              </Link>
            </li>
            <li>
              <Link 
                href="/signin" 
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-body-sm text-body-sm"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h5 className="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider font-bold">Support</h5>
          <ul className="space-y-3 text-body-sm">
            <li>
              <a 
                href="#" 
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-body-sm text-body-sm"
              >
                Support Center
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-body-sm text-body-sm"
              >
                Secure Payment
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-body-sm text-body-sm"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h5 className="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider font-bold">Newsletter</h5>
          <p className="text-on-surface-variant font-body-sm text-body-sm mb-4">
            Join our community for exclusive tips and offers.
          </p>
          <div className="flex gap-2">
            <input 
              className="bg-surface border border-outline-variant/40 rounded-lg px-4 py-2 text-body-sm w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface" 
              placeholder="Your email" 
              type="email"
            />
            <button 
              className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
              aria-label="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Optional Admin Console Shortcuts (Visible for admin user) */}
      {userRole === "admin" && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 pb-6">
          <div className="p-3.5 rounded-lg bg-primary-container/10 border border-primary/20 text-left max-w-lg mx-auto">
            <h4 className="text-[10px] font-black uppercase text-primary tracking-wider mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Shortcuts</span>
            </h4>
            <div className="flex flex-wrap gap-4 text-xs">
              {adminLinks.map((al) => (
                <Link key={al.label} href={al.href} className="text-on-surface-variant hover:text-primary hover:underline">
                  {al.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Copyright bottom bar */}
      <div className="px-4 md:px-10 py-4 border-t border-outline-variant/20 text-center max-w-[1280px] mx-auto">
        <p className="text-on-surface-variant font-body-sm text-body-sm opacity-60">
          © {new Date().getFullYear()} artPetShop. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
