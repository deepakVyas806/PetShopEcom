"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";
import { api } from "@/lib/api";


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
      <div className="w-full aspect-square rounded-2xl animate-shimmer" />
      <div className="h-2.5 w-3/4 rounded-full animate-shimmer" />
    </div>
  );
}

export default function ShopByCategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    api.get("/catalog?type=category")
      .then(data => setCategories(data.items ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !categories.length) return null;

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
