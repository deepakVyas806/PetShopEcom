"use client";

import { useRef } from "react";
import ProductCard from "@/components/common/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function RecentlyViewed({ items }) {
  const { addToCart } = useStore();
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-on-surface">Recently Viewed</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="p-1.5 border border-outline-variant rounded-full hover:bg-surface-variant transition-colors cursor-pointer bg-transparent"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-1.5 border border-outline-variant rounded-full hover:bg-surface-variant transition-colors cursor-pointer bg-transparent"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Horizontal strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:-mx-10 md:px-10"
      >
        {items.map((item) => {
          // Map recently-viewed item shape to ProductCard's product shape
          const product = {
            id:    item.id,
            name:  item.name,
            image: item.image,
            price: item.price,
          };
          return (
            <div key={item.id} className="flex-none w-52">
              <ProductCard
                product={product}
                onAddToCart={(p) => addToCart({ ...p, id: p.id })}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
