"use client";

import Link from "next/link";

const BANNERS = [
  {
    headline: "Up to 40% Off",
    sub: "Premium Dog Food",
    badge: "🔥 Flash Deal",
    from: "#f97316",
    to:   "#ef4444",
    emoji: "🐕",
    cta: "Shop Now",
    href: "/marketplace?category=dogs",
  },
  {
    headline: "Buy 2 Get 1 Free",
    sub: "All Cat Treats & Toys",
    badge: "⚡ Hot Deal",
    from: "#a855f7",
    to:   "#6d28d9",
    emoji: "🐱",
    cta: "Grab Offer",
    href: "/marketplace?category=cats",
  },
  {
    headline: "Flat 30% Off",
    sub: "Grooming & Spa Kits",
    badge: "⏱ Limited Time",
    from: "#0ea5e9",
    to:   "#0891b2",
    emoji: "✂️",
    cta: "Explore",
    href: "/marketplace?category=accessories",
  },
];

export default function OfferZoneBanners() {
  return (
    <section className="py-6 px-4 md:px-6 max-w-container-max mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Offer Zone</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Limited-time deals — grab them fast!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {BANNERS.map((b, i) => (
          <Link
            key={i}
            href={b.href}
            className="relative rounded-2xl p-5 overflow-hidden flex flex-col justify-between min-h-[150px] hover:shadow-xl hover:scale-[1.015] active:scale-[0.99] transition-all duration-200 group"
            style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
          >
            {/* Badge */}
            <span className="self-start bg-black/20 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {b.badge}
            </span>

            {/* Background emoji */}
            <div className="absolute -bottom-3 -right-2 text-8xl opacity-15 select-none group-hover:opacity-25 transition-opacity pointer-events-none">
              {b.emoji}
            </div>

            {/* Text */}
            <div className="mt-3">
              <p className="text-white font-black text-2xl leading-tight drop-shadow-sm">{b.headline}</p>
              <p className="text-white/80 text-xs mt-1 font-medium">{b.sub}</p>
            </div>

            {/* CTA */}
            <span className="mt-4 self-start bg-white text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-sm group-hover:bg-white/95 transition-colors">
              {b.cta} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
