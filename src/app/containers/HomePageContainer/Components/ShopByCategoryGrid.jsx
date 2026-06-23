"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowRight } from "@/lib/icons";

const CATEGORIES = [
  {
    label: "Food & Treats",
    href:  "/marketplace?type=food",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&q=80&fit=crop&auto=format",
    initial: "🍗",
  },
  {
    label: "Toys & Play",
    href:  "/marketplace?type=toy",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&q=80&fit=crop&auto=format",
    initial: "🎾",
  },
  {
    label: "Health & Pharma",
    href:  "/marketplace?type=health",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=300&q=80&fit=crop&auto=format",
    initial: "💊",
  },
  {
    label: "Grooming",
    href:  "/marketplace?type=grooming",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&q=80&fit=crop&auto=format",
    initial: "✂️",
  },
  {
    label: "Beds & Houses",
    href:  "/marketplace?type=beds",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80&fit=crop&auto=format",
    initial: "🛏️",
  },
  {
    label: "Accessories",
    href:  "/marketplace?type=accessories",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=300&q=80&fit=crop&auto=format",
    initial: "🏷️",
  },
  {
    label: "Aquatics",
    href:  "/marketplace?category=fish",
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&q=80&fit=crop&auto=format",
    initial: "🐟",
  },
  {
    label: "Birds & Exotics",
    href:  "/marketplace?category=birds",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&q=80&fit=crop&auto=format",
    initial: "🦜",
  },
];

function CategoryCard({ label, href, image, initial }) {
  const [errored, setErrored] = useState(false);

  return (
    <Link href={href} className="group flex flex-col items-center gap-2 min-w-0">
      {/* Square image */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-95">
        {!errored ? (
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center text-2xl">
            {initial}
          </div>
        )}
      </div>

      {/* Label */}
      <span className="text-[11px] font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors duration-200 text-center leading-tight w-full truncate">
        {label}
      </span>
    </Link>
  );
}

export default function ShopByCategoryGrid() {
  return (
    <section className="w-full py-7 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-extrabold text-on-surface">Shop by Category</h2>
          <Link href="/marketplace" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
            See all <IconArrowRight size={13} weight="bold" />
          </Link>
        </div>

        {/* 4-col mobile → 8-col desktop */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-4 md:gap-x-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.label} {...cat} />
          ))}
        </div>

      </div>
    </section>
  );
}
