"use client";

import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { IconArrowRight } from "@/lib/icons";

export default function BestSellers({
  premiumShowcase,
  addedItems,
  handleAddToCart,
  favorites,
  toggleFavorite,
}) {
  return (
    <section className="bg-surface-container-low py-5 border-y border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        <div className="text-center mb-4">
          <h2 className="text-sm font-bold text-on-surface">Best Sellers</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Our most loved premium pet products</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline mt-1"
          >
            View All <IconArrowRight size={13} className="leading-none" weight="regular" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
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
