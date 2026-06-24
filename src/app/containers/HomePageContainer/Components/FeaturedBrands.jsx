"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";
import { api } from "@/lib/api";

const FALLBACK = [
  { name: "Royal Canin", slug: "royal-canin", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjINrjnwjQx6HpAUFgy3gQ10_w-n_4o2eIVA&s" },
  { name: "Pedigree",    slug: "pedigree",    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SuDcoSysHZRhXMrSNlo93bDaXLlcU0e2AA&s" },
  { name: "Purina",      slug: "purina",      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-1vTH9694tY4cOwiU6UGMatBr713plNQqig&s" },
  { name: "Whiskas",     slug: "whiskas",     logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c9/Whiskas_logo.png" },
  { name: "Himalaya",    slug: "himalaya",    logoUrl: "https://himalayausa.com/cdn/shop/files/SOCIAL-SHARING-IMG.png?v=1761305370" },
  { name: "Drools",      slug: "drools",      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyqfj-US2moaFk2RPArWJLUTmrQg0Q1BWUBw&s" },
  { name: "Trixie",      slug: "trixie",      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ-xXPxwX4uNJ9ZmfyWAlED0rxpHshnqj1QQ&s" },
  { name: "Beaphar",     slug: "beaphar",     logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJYAV8WRkCdZiPW2YAC0fuWZA4kxYf7rTSQ&s" },
];

function BrandCard({ name, slug, logoUrl }) {
  const [errored, setErrored] = useState(false);
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return (
    <Link href={`/marketplace?brand=${slug}`} className="group flex flex-col items-center gap-2 min-w-0 flex-1">
      <div className="w-full aspect-square rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-95 bg-surface-container-low border border-outline-variant/20">
        {logoUrl && !errored ? (
          <img src={logoUrl} alt={name} className="w-full h-full object-contain p-2" onError={() => setErrored(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/8">
            <span className="text-sm font-black text-primary">{initials}</span>
          </div>
        )}
      </div>
      <span className="text-[11px] font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors duration-200 text-center truncate w-full">
        {name}
      </span>
    </Link>
  );
}

function BrandSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-full aspect-square rounded-2xl bg-surface-container-high animate-pulse" />
      <div className="h-2.5 w-3/4 rounded-full bg-surface-container-high animate-pulse" />
    </div>
  );
}

export default function FeaturedBrands() {
  const [brands,  setBrands]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/catalog?type=brand")
      .then(data => {
        const items = data.items ?? [];
        setBrands(items.length > 0 ? items : FALLBACK);
      })
      .catch(() => setBrands(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full py-7 bg-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-extrabold text-on-surface">Shop by Brand</h2>
          <Link href="/marketplace" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
            View All <IconArrowRight size={13} weight="bold" />
          </Link>
        </div>

        <div className="flex items-start gap-3 md:gap-4 w-full">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <BrandSkeleton key={i} />)
            : brands.slice(0, 8).map(brand => (
                <BrandCard
                  key={brand._id ?? brand.slug ?? brand.name}
                  name={brand.name}
                  slug={brand.slug}
                  logoUrl={brand.logoUrl}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
}
