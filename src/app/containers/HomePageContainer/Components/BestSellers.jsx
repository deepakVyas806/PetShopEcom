"use client";

import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";

export default function BestSellers({
  premiumShowcase,
  addedItems,
  handleAddToCart,
  favorites,
  toggleFavorite,
}) {
  return (
    <section className="bg-surface-container-low py-6 border-y border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-on-surface">Best Sellers</h2>
          <Link
            href="/marketplace"
            className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
          >
            View All
            <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Full-width grid — 2 cols on mobile, 3 on sm, 5 on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {premiumShowcase.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites?.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              isAdded={!!addedItems[product.id]}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
