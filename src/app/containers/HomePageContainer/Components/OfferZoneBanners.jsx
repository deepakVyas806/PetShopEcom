"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";


function BannerSkeleton() {
  return (
    <div className="rounded-2xl animate-shimmer min-h-[150px]" />
  );
}

export default function OfferZoneBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/offers?landingPage=true")
      .then(data => setBanners(data.offers ?? []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !banners.length) return null;

  return (
    <section className="py-6 px-4 md:px-6 max-w-container-max mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Offer Zone</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Limited-time deals — grab them fast!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <BannerSkeleton key={i} />)
          : banners.map(b => (
              <Link
                key={b._id}
                href={b.ctaHref || "/marketplace"}
                className="relative rounded-2xl p-5 overflow-hidden flex flex-col justify-between min-h-[150px] hover:shadow-card-lg hover:scale-[1.015] active:scale-[0.99] transition-all duration-200 group"
                style={{ background: `linear-gradient(135deg, ${b.gradientFrom || "#f97316"}, ${b.gradientTo || "#ef4444"})` }}
              >
                {b.badge && (
                  <span className="self-start bg-black/20 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {b.badge}
                  </span>
                )}
                {b.emoji && (
                  <div className="absolute -bottom-3 -right-2 text-8xl opacity-15 select-none group-hover:opacity-25 transition-opacity pointer-events-none">
                    {b.emoji}
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-white font-black text-2xl leading-tight drop-shadow-sm">{b.headline}</p>
                  {b.subtitle && <p className="text-white/80 text-xs mt-1 font-medium">{b.subtitle}</p>}
                </div>
                <span className="mt-4 self-start bg-white text-on-surface text-xs font-black px-4 py-1.5 rounded-full shadow-card-sm group-hover:bg-white/95 transition-colors">
                  {b.ctaLabel || "Shop Now"} →
                </span>
              </Link>
            ))
        }
      </div>
    </section>
  );
}
