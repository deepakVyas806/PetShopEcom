"use client";

import { useStore } from "@/context/StoreContext";
import ProductCard  from "@/components/common/ProductCard";
import WishlistEmpty from "./WishlistEmpty";

export default function WishlistGrid({ items, onRemove }) {
  const { addToCart } = useStore();

  if (items.length === 0) return <WishlistEmpty />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          product={{
            id:           item.id,
            name:         item.name,
            image:        item.image,
            price:        item.price,
            mrp:          item.originalPrice ?? undefined,
            meta:         `${item.category} · ${item.type}`,
            description:  item.description ?? undefined,
            rating:       item.rating ?? undefined,
            reviewsCount: item.reviewsCount ?? undefined,
          }}
          isFavorite={true}
          onToggleFavorite={() => onRemove(item.id)}
          onAddToCart={(product) => addToCart({ _id: item.id, name: item.name, price: item.price, image: item.image })}
          stockOverlay={item.stock === "outOfStock"}
        />
      ))}
    </div>
  );
}
