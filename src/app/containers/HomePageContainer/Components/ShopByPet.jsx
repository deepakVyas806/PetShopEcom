"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

// Visual extras keyed by catalog slug — merged with API data
const EXTRAS = {
  dogs:        { emoji: "🐕", subs: ["Food", "Toys", "Beds", "Grooming"],     accent: "border-orange-400", ring: "ring-orange-400/30" },
  cats:        { emoji: "🐱", subs: ["Food", "Toys", "Litter", "Scratchers"], accent: "border-pink-400",   ring: "ring-pink-400/30"   },
  birds:       { emoji: "🦜", subs: ["Seed & Feed", "Cages", "Toys"],         accent: "border-emerald-400",ring: "ring-emerald-400/30" },
  fish:        { emoji: "🐠", subs: ["Tanks", "Food", "Decorations"],         accent: "border-cyan-400",   ring: "ring-cyan-400/30"   },
  "small-pets":{ emoji: "🐹", subs: ["Hamsters", "Rabbits", "Guinea Pigs"],   accent: "border-violet-400", ring: "ring-violet-400/30" },
};

const PALETTE = [
  { accent: "border-orange-400", ring: "ring-orange-400/30" },
  { accent: "border-pink-400",   ring: "ring-pink-400/30"   },
  { accent: "border-emerald-400",ring: "ring-emerald-400/30"},
  { accent: "border-cyan-400",   ring: "ring-cyan-400/30"   },
  { accent: "border-violet-400", ring: "ring-violet-400/30" },
];

export default function ShopByPet() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/catalog?type=petType").then(data => {
      const merged = (data.items ?? []).map((item, i) => {
        const ex = EXTRAS[item.slug] ?? PALETTE[i % PALETTE.length];
        return {
          slug:    item.slug,
          name:    item.name,
          imageUrl:item.imageUrl ?? "",
          emoji:   ex.emoji  ?? "🐾",
          subs:    ex.subs   ?? [],
          count:   item.count ?? "",
          accent:  ex.accent,
          ring:    ex.ring,
        };
      });
      setPets(merged);
    }).catch(() => setPets([]));
  }, []);

  if (!pets.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Shop by Pet</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Find the perfect products for your companion</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 md:grid md:grid-cols-5 md:overflow-visible">
        {pets.map(({ slug, name, emoji, imageUrl, subs, count, accent, ring }) => (
          <Link
            key={slug}
            href={`/marketplace?category=${slug}`}
            className="group shrink-0 w-36 md:w-auto flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className={`w-full aspect-square rounded-full overflow-hidden border-4 ${accent} bg-surface-container group-hover:shadow-card-md group-hover:ring-4 ${ring} transition-all duration-300`}>
              {imageUrl ? (
                <img
                  alt={name}
                  src={imageUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">{emoji}</div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                {emoji} {name}
              </p>
              {count && <p className="text-[9px] text-on-surface-variant">{count}+ products</p>}
            </div>

            {subs.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 max-w-[140px]">
                {subs.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="text-[8px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full border border-outline-variant/20 group-hover:border-primary/30 group-hover:text-primary transition-colors"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
