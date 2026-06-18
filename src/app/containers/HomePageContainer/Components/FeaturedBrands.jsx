"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";

const BRANDS = [
  { name: "Royal Canin", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjINrjnwjQx6HpAUFgy3gQ10_w-n_4o2eIVA&s", href: "/marketplace?brand=royal-canin", initial: "RC", accent: "#C8102E" },
  { name: "Pedigree",    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SuDcoSysHZRhXMrSNlo93bDaXLlcU0e2AA&s", href: "/marketplace?brand=pedigree",    initial: "PG", accent: "#0047AB" },
  { name: "Purina",      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-1vTH9694tY4cOwiU6UGMatBr713plNQqig&s", href: "/marketplace?brand=purina",      initial: "PR", accent: "#E31837" },
  { name: "Whiskas",     logo: "https://upload.wikimedia.org/wikipedia/en/c/c9/Whiskas_logo.png",                                href: "/marketplace?brand=whiskas",     initial: "WK", accent: "#6D28D9" },
  { name: "Himalaya",    logo: "https://himalayausa.com/cdn/shop/files/SOCIAL-SHARING-IMG.png?v=1761305370",                     href: "/marketplace?brand=himalaya",    initial: "HM", accent: "#2E7D32" },
  { name: "Drools",      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyqfj-US2moaFk2RPArWJLUTmrQg0Q1BWUBw&s", href: "/marketplace?brand=drools",      initial: "DR", accent: "#0E7490" },
  { name: "Trixie",      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ-xXPxwX4uNJ9ZmfyWAlED0rxpHshnqj1QQ&s", href: "/marketplace?brand=trixie",      initial: "TX", accent: "#B45309" },
  { name: "Beaphar",     logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJYAV8WRkCdZiPW2YAC0fuWZA4kxYf7rTSQ&s", href: "/marketplace?brand=beaphar",     initial: "BP", accent: "#9D174D" },
];

function BrandCard({ name, logo, href, initial, accent }) {
  const [errored, setErrored] = useState(false);

  return (
    <Link href={href} className="group flex flex-col items-center gap-2 min-w-0 flex-1">
      {/* Square image */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-95">
        {!errored ? (
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${accent}22` }}
          >
            <span className="text-base font-black" style={{ color: accent }}>{initial}</span>
          </div>
        )}
      </div>

      {/* Brand name */}
      <span className="text-[11px] font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors duration-200 text-center truncate w-full">
        {name}
      </span>
    </Link>
  );
}

export default function FeaturedBrands() {
  return (
    <section className="w-full py-7 bg-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-extrabold text-on-surface">Shop by Brand</h2>
          <Link href="/marketplace" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
            View All <IconArrowRight size={13} weight="bold" />
          </Link>
        </div>

        {/* Full-width brand grid */}
        <div className="flex items-start gap-3 md:gap-4 w-full">
          {BRANDS.map((brand) => (
            <BrandCard key={brand.name} {...brand} />
          ))}
        </div>

      </div>
    </section>
  );
}
