"use client";

import PageHeader from "@/components/common/PageHeader";

export default function WishlistHeader({ count, onAddAllToCart }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",       href: "/"        },
        { label: "My Account", href: "/profile" },
        { label: "Wishlist"                     },
      ]}
      title={`My Wishlist (${count})`}
      subtitle="Save items you love and move them to cart when you're ready."
    >
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer bg-transparent">
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>share</span>
        Share
      </button>
      <button
        onClick={onAddAllToCart}
        className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:shadow-md transition-all cursor-pointer border-none"
      >
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>add_shopping_cart</span>
        Add All to Cart
      </button>
    </PageHeader>
  );
}
