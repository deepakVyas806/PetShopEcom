"use client";

import Link from "next/link";

export default function WishlistHeader({ count, onAddAllToCart }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">

      {/* Left: breadcrumb + title */}
      <div>
        <nav className="flex items-center text-xs text-on-surface-variant mb-2 gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface">Wishlist</span>
        </nav>
        <h1 className="text-base font-extrabold text-on-surface tracking-tight">
          My Wishlist{" "}
          <span className="text-primary-container font-medium">({count})</span>
        </h1>
      </div>

      {/* Right: action buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2 cursor-pointer bg-transparent text-on-surface">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span>
          Share List
        </button>
        <button
          onClick={onAddAllToCart}
          className="px-4 py-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-full text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-none active:scale-95"
        >
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>add_shopping_cart</span>
          Add All to Cart
        </button>
      </div>
    </div>
  );
}
