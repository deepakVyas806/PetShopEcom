"use client";

import WishlistCard  from "./WishlistCard";
import WishlistEmpty from "./WishlistEmpty";

export default function WishlistGrid({ items, movingIds, onRemove, onMoveToCart }) {
  if (items.length === 0) return <WishlistEmpty />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
      {items.map((item) => (
        <WishlistCard
          key={item.id}
          item={item}
          isMoving={movingIds.has(item.id)}
          onRemove={() => onRemove(item.id)}
          onMoveToCart={() => onMoveToCart(item)}
        />
      ))}
    </div>
  );
}
