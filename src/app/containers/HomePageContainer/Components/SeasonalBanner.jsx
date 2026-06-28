"use client";

import Link from "next/link";
import { IconLightning, IconArrowRight } from "@/lib/icons";

export default function SeasonalBanner() {
  return (
    <section className="py-4 px-4 md:px-6 max-w-container-max mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #3b0764 40%, #630ed4 75%, #7c3aed 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-4 right-1/3 w-2 h-2 rounded-full bg-white/30 pointer-events-none" />
        <div className="absolute bottom-6 right-1/4 w-1.5 h-1.5 rounded-full bg-white/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-10 py-7">
          {/* Left: text */}
          <div className="text-white text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <IconLightning size={11} weight="fill" />
                Monsoon Special
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black leading-tight">
              Monsoon Pet Care<br />
              <span className="text-purple-200">Essentials Kit</span>
            </h2>
            <p className="text-white/70 text-sm mt-2 max-w-sm">
              Keep your pet healthy &amp; dry this season. Waterproof gear, immunity boosters, anti-tick treatments &amp; more.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start">
              <Link
                href="/marketplace"
                className="bg-white text-primary font-black text-xs px-6 py-2.5 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-card-md flex items-center gap-1.5"
              >
                Shop Monsoon Kits <IconArrowRight size={14} weight="bold" />
              </Link>
              <span className="text-white/60 text-xs">Starting from <span className="text-white font-bold">₹199</span></span>
            </div>
          </div>

          {/* Right: emoji art */}
          <div className="flex items-center gap-3 shrink-0">
            {["🌧️", "🐕", "💊", "🧴"].map((em, i) => (
              <div
                key={i}
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl hover:scale-110 transition-transform border border-white/20"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {em}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
