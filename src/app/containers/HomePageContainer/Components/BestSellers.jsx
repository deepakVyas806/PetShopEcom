"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { IconArrowRight } from "@/lib/icons";
import { api } from "@/lib/api";

const TABS = [
  { id: "popular",  label: "Best Sellers",  params: "?featured=true&sortBy=Popularity" },
  { id: "new",      label: "New Arrivals",  params: "?sortBy=Newest" },
  { id: "rated",    label: "Top Rated",     params: "?sortBy=Rating" },
  { id: "budget",   label: "Under ₹499",    params: "?maxPrice=499&sortBy=Popularity" },
];

export default function BestSellers({
  premiumShowcase,
  addedItems,
  handleAddToCart,
  favorites,
  toggleFavorite,
}) {
  const [activeTab,  setActiveTab]  = useState("popular");
  const [products,   setProducts]   = useState(premiumShowcase ?? []);
  const [loading,    setLoading]    = useState(false);

  /* keep in sync when parent prop updates (initial load) */
  useEffect(() => {
    if (premiumShowcase?.length) setProducts(premiumShowcase);
  }, [premiumShowcase]);

  const handleTab = (tab) => {
    if (tab.id === activeTab) return;
    setActiveTab(tab.id);

    if (tab.id === "popular" && premiumShowcase?.length) {
      setProducts(premiumShowcase);
      return;
    }

    setLoading(true);
    api.get(`/products${tab.params}&limit=5`)
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-surface-container-low py-5 border-y border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-sm font-bold text-on-surface">Top Products</h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Our most loved picks</p>
          </div>
          <Link
            href="/marketplace"
            className="shrink-0 inline-flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline mt-1"
          >
            View All <IconArrowRight size={13} weight="regular" />
          </Link>
        </div>

        {/* Tab strip */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer outline-none whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface text-on-surface-variant border-outline-variant/30 hover:border-primary hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-surface-container animate-pulse aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.slice(0, 5).map((product, i) => (
              <ProductCard
                key={product._id ?? product.id ?? i}
                product={product}
                isFavorite={favorites?.includes(product._id ?? product.id)}
                onToggleFavorite={toggleFavorite}
                isAdded={!!addedItems[product._id ?? product.id]}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
