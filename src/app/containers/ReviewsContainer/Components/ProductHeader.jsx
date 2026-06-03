"use client";

import Link from "next/link";
import StarRating from "./StarRating";

export default function ProductHeader({ product }) {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-4 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 13 }}>chevron_right</span>
        <Link href="/marketplace" className="hover:text-primary transition-colors capitalize">
          {product.category}
        </Link>
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 13 }}>chevron_right</span>
        <span className="text-on-surface truncate max-w-[160px]">{product.name}</span>
      </nav>

      {/* Product header */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-center">
        <div className="md:col-span-2">
          <div className="rounded-xl overflow-hidden aspect-square border border-outline-variant/30 w-20 md:w-full">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-10 space-y-2">
          <h1 className="text-sm font-bold text-on-surface leading-snug">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={product.rating} size={14} />
            <span className="text-xs font-bold text-on-surface">{product.rating}</span>
            <span className="text-[10px] text-on-surface-variant">
              ({product.reviewCount?.toLocaleString()} ratings)
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
