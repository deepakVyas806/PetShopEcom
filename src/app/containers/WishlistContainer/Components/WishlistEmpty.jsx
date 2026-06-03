"use client";

import Link from "next/link";

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-56 h-56 mb-8 bg-secondary-container rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 80, fontVariationSettings: "'FILL' 1" }}>
          favorite
        </span>
      </div>
      <h2 className="text-sm font-bold text-on-surface mb-2">Your Wishlist is Empty</h2>
      <p className="text-xs text-on-surface-variant max-w-md mb-8">
        It looks like you haven't saved any items yet. Explore our premium collections
        to find something special for your furry friends!
      </p>
      <Link
        href="/marketplace"
        className="px-8 py-3.5 bg-primary text-on-primary rounded-2xl font-bold hover:shadow-xl active:scale-95 transition-all"
      >
        Start Shopping
      </Link>
    </div>
  );
}
