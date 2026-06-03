"use client";

import Link from "next/link";

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 mb-4 bg-secondary-container rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          favorite
        </span>
      </div>
      <h2 className="text-sm font-bold text-on-surface mb-1">Your Wishlist is Empty</h2>
      <p className="text-xs text-on-surface-variant max-w-xs mb-5 leading-relaxed">
        Save items you love and find them here anytime. Explore our premium collections!
      </p>
      <Link
        href="/marketplace"
        className="px-6 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all"
      >
        Start Shopping
      </Link>
    </div>
  );
}
