"use client";

import Link from "next/link";
import { IconStar, IconBag } from "@/lib/icons";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden w-full" style={{ aspectRatio: "16/7", minHeight: 220 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="absolute inset-0 w-full h-full object-cover object-center"
        alt="Elevated Care for Every Companion"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcMLlXcu8SrlbiwnkM8pqYLwiBhQshPT4bfQphoU5Tla8cLgAKLMzbl3GXifcuCBlZ9IfQFnpxiBWc_tphc1--W_B5oFJPQd8Bb1xaQee7KJYjCoTxHXWLLq0AxLKubnKofa_uUbUJgrk6RkOQl4pIJWoI4t83MvYp0J75JDXmHAZLfNXvcGY2HZnJm7QeguizdMzDg-A6GxcFWN-gP0Cy71JN7pZS3amuRzO9EA6rg4_dsLjeVYGQ5r41PRF24xIXNz7ycSpQBTc5"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(21,28,39,0.72) 0%, rgba(21,28,39,0.3) 55%, transparent 100%)" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-4 md:px-margin-desktop">
        <div className="max-w-sm text-white space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
            <IconStar size={12} className="leading-none" weight="fill" />
            Premium Pet Care
          </span>

          <h1 className="text-base md:text-lg font-extrabold leading-snug drop-shadow-sm">
            Elevated Care for<br />Every Companion
          </h1>

          <p className="text-xs text-white/85 leading-relaxed max-w-xs drop-shadow-sm">
            Curated premium nutrition and artisanal accessories for the modern pet owner.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2 rounded-full text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              <IconBag size={14} className="leading-none" weight="bold" />
              Shop Now
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-5 py-2 rounded-full text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip — bottom right, desktop only */}
      <div className="absolute bottom-4 right-4 md:right-margin-desktop hidden md:flex items-center gap-5">
        {[
          { value: "10k+", label: "Happy Pets" },
          { value: "5★",   label: "Rated"      },
          { value: "Free", label: "Delivery"   },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-white text-xs font-black leading-none">{value}</p>
            <p className="text-white/60 text-[9px] uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
