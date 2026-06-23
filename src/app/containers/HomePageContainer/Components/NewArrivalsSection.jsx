"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/common/ProductCard";
import { IconArrowRight, IconSparkle } from "@/lib/icons";

export default function NewArrivalsSection({ addedItems, handleAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products?sortBy=Newest Arrivals&limit=10")
      .then((data) => setProducts(data.products ?? data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-6 px-4 md:px-6 max-w-container-max mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 p-1.5 rounded-xl">
            <IconSparkle size={16} className="text-primary" weight="fill" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">Just Arrived</h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">New products added this week</p>
          </div>
        </div>
        <Link
          href="/marketplace?sortBy=Newest%20Arrivals"
          className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5"
        >
          View All <IconArrowRight size={13} weight="bold" />
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-52 h-64 bg-surface-container-low rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {products.map((product) => (
            <div key={product._id ?? product.id} className="flex-shrink-0 w-52">
              <ProductCard
                product={product}
                isAdded={!!addedItems?.[product._id ?? product.id]}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}

          {/* View all card */}
          <Link
            href="/marketplace?sortBy=Newest%20Arrivals"
            className="flex-shrink-0 w-44 min-h-[200px] flex flex-col items-center justify-center gap-2 bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <IconArrowRight size={18} className="text-primary" weight="bold" />
            </div>
            <p className="text-xs font-bold text-primary text-center leading-snug px-3">
              View All<br />New Arrivals
            </p>
          </Link>
        </div>
      )}
    </section>
  );
}
