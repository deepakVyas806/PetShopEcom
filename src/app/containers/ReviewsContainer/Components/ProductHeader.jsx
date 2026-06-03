"use client";

import Link from "next/link";
import StarRating from "./StarRating";

export default function ProductHeader({ product }) {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>chevron_right</span>
        <Link href="/marketplace?category=dogs" className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>chevron_right</span>
        <span className="text-on-surface">{product.name}</span>
      </nav>

      {/* Product header grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-8 items-center">
        {/* Thumbnail */}
        <div className="md:col-span-3">
          <div className="rounded-xl overflow-hidden aspect-square border border-outline-variant/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title + rating */}
        <div className="md:col-span-9 space-y-3">
          <h1 className="text-base font-extrabold text-primary tracking-tight leading-snug">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <StarRating rating={product.rating} size={20} />
            <span className="text-sm font-bold text-on-surface">{product.rating} out of 5</span>
            <span className="text-xs text-on-surface-variant">
              ({product.reviewCount.toLocaleString()} global ratings)
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
