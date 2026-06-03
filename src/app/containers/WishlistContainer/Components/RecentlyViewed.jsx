"use client";

import { useRef } from "react";
import ProductCard from "@/components/common/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function RecentlyViewed({ items }) {
  const { addToCart } = useStore();
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  if (!items?.length) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-on-surface">Recently Viewed</h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => scroll(-1)}
            className="p-1 border border-outline-variant rounded-full hover:bg-surface-variant transition-colors cursor-pointer bg-transparent"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-1 border border-outline-variant rounded-full hover:bg-surface-variant transition-colors cursor-pointer bg-transparent"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-none w-48">
            <ProductCard
              product={{ id: item.id, name: item.name, image: item.image, price: item.price }}
              onAddToCart={(p) => addToCart({ ...p, id: p.id })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
