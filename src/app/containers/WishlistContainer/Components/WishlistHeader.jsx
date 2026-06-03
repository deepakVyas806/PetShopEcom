"use client";

import Link from "next/link";

export default function WishlistHeader({ count, onAddAllToCart }) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <nav className="flex items-center text-xs text-on-surface-variant mb-1 gap-1.5">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 13 }}>chevron_right</span>
          <span className="text-on-surface font-medium">Wishlist</span>
        </nav>
        <h1 className="text-sm font-bold text-on-surface">
          My Wishlist <span className="text-on-surface-variant font-normal text-xs">({count})</span>
        </h1>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-medium hover:bg-surface-variant transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent text-on-surface">
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>share</span>
          Share
        </button>
        <button
          onClick={onAddAllToCart}
          className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-none active:scale-95"
        >
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>add_shopping_cart</span>
          Add All to Cart
        </button>
      </div>
    </div>
  );
}
