"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";
import { api } from "@/lib/api";

const FALLBACK = [
  { name: "Food & Treats",    slug: "food",        imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&q=80&fit=crop&auto=format", icon: "🍗" },
  { name: "Toys & Play",      slug: "toys",        imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&q=80&fit=crop&auto=format", icon: "🎾" },
  { name: "Health & Pharma",  slug: "health",      imageUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=300&q=80&fit=crop&auto=format", icon: "💊" },
  { name: "Grooming",         slug: "grooming",    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&q=80&fit=crop&auto=format", icon: "✂️" },
  { name: "Beds & Houses",    slug: "beds",        imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80&fit=crop&auto=format", icon: "🛏️" },
  { name: "Accessories",      slug: "accessories", imageUrl: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=300&q=80&fit=crop&auto=format", icon: "🏷️" },
  { name: "Aquatics",         slug: "fish",        imageUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&q=80&fit=crop&auto=format", icon: "🐟" },
  { name: "Birds & Exotics",  slug: "birds",       imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&q=80&fit=crop&auto=format", icon: "🦜" },
];

function CategoryCard({ name, slug, imageUrl, icon }) {
  const [errored, setErrored] = useState(false);
  return (
    <Link href={`/marketplace?category=${slug}`} className="group flex flex-col items-center gap-2 min-w-0">
      <div className="w-full aspect-square rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-95">
        {imageUrl && !errored ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" onError={() => setErrored(true)} />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center text-2xl">
            {icon || name.slice(0, 2)}
          </div>
        )}
      </div>
      <span className="text-[11px] font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors duration-200 text-center leading-tight w-full truncate">
        {name}
      </span>
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full aspect-square rounded-2xl bg-surface-container-high animate-pulse" />
      <div className="h-2.5 w-3/4 rounded-full bg-surface-container-high animate-pulse" />
    </div>
  );
}

export default function ShopByCategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    api.get("/catalog?type=category")
      .then(data => {
        const items = data.items ?? [];
        setCategories(items.length > 0 ? items : FALLBACK);
      })
      .catch(() => setCategories(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full py-7 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-extrabold text-on-surface">Shop by Category</h2>
          <Link href="/marketplace" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
            See all <IconArrowRight size={13} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-4 md:gap-x-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.slice(0, 8).map(cat => (
                <CategoryCard
                  key={cat._id ?? cat.slug ?? cat.name}
                  name={cat.name}
                  slug={cat.slug}
                  imageUrl={cat.imageUrl}
                  icon={cat.icon}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
}
