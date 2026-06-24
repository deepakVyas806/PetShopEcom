"use client";

import { IconNavigate } from "@/lib/icons";

export default function MapSection({ driver }) {
  return (
    <div className="rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm h-64 relative group">
      {/* Map image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz0m9HIQKQgXPSGzQ-_71GylkWNY-hGup6YK_xZtU35qYj52n2HnHxUuaesyfcT9OIqMT-r_hZjhDHcqMfFvpuaGFidsc8i8WCTL-BvvJaVXz2L2q6B_M2WtICNSnNmkZZEr1BOmkLIPDGM-PxPm_SqLFu19HmeyAm-SdkA7UY8jc7SboUWYTq1Of8q44l1Hns9jy4AuA8fjLVbMWo97s3iYqqUDkix4s3G19DvJLvwjNGGdoPi1CvEu_OlxTiJ7Ao7wzG0ZbrFi6N"
        alt="Delivery map"
        className="w-full h-full object-cover grayscale-[0.15] group-hover:scale-105 transition-transform duration-700"
      />

      {/* Dark overlay at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }}
      />

      {/* Driver info pill — only shown when driver data is available */}
      {driver && (
        <div
          className="absolute bottom-4 left-4 flex items-center gap-3 px-3 py-2 rounded-xl border border-white/20 shadow-lg"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}
        >
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
            <IconNavigate size={18} weight="fill" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Driver: {driver.name}
            </p>
            <p className="text-[10px] text-on-surface-variant">
              {driver.distance} &bull; {driver.heading}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
