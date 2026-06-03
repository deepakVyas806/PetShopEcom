"use client";

import useWishlistContainer from "./WishlistContainer.hook";
import WishlistHeader   from "./Components/WishlistHeader";
import WishlistGrid     from "./Components/WishlistGrid";
import RecentlyViewed   from "./Components/RecentlyViewed";

export default function WishlistContainer() {
  const {
    wishlistItems,
    movingIds,
    recentlyViewed,
    removeFromWishlist,
    moveToCart,
    addAllToCart,
  } = useWishlistContainer();

  return (
    <main className="py-2">

      <WishlistHeader
        count={wishlistItems.length}
        onAddAllToCart={addAllToCart}
      />

      <WishlistGrid
        items={wishlistItems}
        movingIds={movingIds}
        onRemove={removeFromWishlist}
        onMoveToCart={moveToCart}
      />

      <RecentlyViewed items={recentlyViewed} />

    </main>
  );
}
