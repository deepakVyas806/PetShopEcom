"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";

const BRANDS = [
  { name: "Royal Canin", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Royal-Canin-Logo.svg/320px-Royal-Canin-Logo.svg.png", href: "/marketplace?brand=royal-canin", initial: "RC", color: "#B45309" },
  { name: "Pedigree",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Pedigree_logo_new.svg/320px-Pedigree_logo_new.svg.png",    href: "/marketplace?brand=pedigree",    initial: "PG", color: "#B91C1C" },
  { name: "Purina",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nestl%C3%A9_Purina_logo.svg/320px-Nestl%C3%A9_Purina_logo.svg.png", href: "/marketplace?brand=purina", initial: "PR", color: "#1D4ED8" },
  { name: "Whiskas",     logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Whiskas_logo.png/250px-Whiskas_logo.png",                         href: "/marketplace?brand=whiskas",     initial: "WK", color: "#6D28D9" },
  { name: "Himalaya",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/The_Himalaya_Drug_Company_logo.svg/320px-The_Himalaya_Drug_Company_logo.svg.png", href: "/marketplace?brand=himalaya", initial: "HM", color: "#166534" },
  { name: "Drools",      logo: "https://logo.clearbit.com/drools.in",  href: "/marketplace?brand=drools",  initial: "DR", color: "#0E7490" },
  { name: "Trixie",      logo: "https://logo.clearbit.com/trixie.de",  href: "/marketplace?brand=trixie",  initial: "TX", color: "#C2410C" },
  { name: "Beaphar",     logo: "https://logo.clearbit.com/beaphar.com", href: "/marketplace?brand=beaphar", initial: "BP", color: "#9D174D" },
];

function BrandCard({ name, logo, href, initial, color }) {
  const [errored, setErrored] = useState(false);

  return (
    <Link href={href} className="group flex-shrink-0">
      <div
        className="rounded-2xl flex items-center justify-center bg-white transition-all duration-200 group-hover:scale-105 group-hover:shadow-md"
        style={{ width: 110, height: 72, padding: 14 }}
      >
        {!errored ? (
          <img
            src={logo}
            alt={name}
            className="rounded-xl"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={() => setErrored(true)}
          />
        ) : (
          <div
            className="w-full h-full rounded-xl flex items-center justify-center"
            style={{ background: color }}
          >
            <span className="text-xs font-black text-white">{initial}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function FeaturedBrands() {
  return (
    <section
      className="w-full bg-white"
      style={{ borderTop: "8px solid #f1f3f6", borderBottom: "8px solid #f1f3f6" }}
    >
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-on-surface">Shop by Brand</h2>
          <Link href="/marketplace" className="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline">
            View All <IconArrowRight size={13} weight="bold" />
          </Link>
        </div>

        {/* Circular brand logos — horizontal scroll */}
        <div className="flex items-start gap-5 overflow-x-auto no-scrollbar pb-1">
          {BRANDS.map((brand) => (
            <BrandCard key={brand.name} {...brand} />
          ))}
        </div>

      </div>
    </section>
  );
}
