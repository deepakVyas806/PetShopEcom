"use client";

import React, { useState } from "react";
import Link from "next/link";
import useProductDetails from "./ProductDetailsContainer.hook";
import { fmt } from "@/lib/currency";
import ReviewCard from "@/app/containers/ReviewsContainer/Components/ReviewCard";
import RatingSummary from "@/app/containers/ReviewsContainer/Components/RatingSummary";
import StarRating from "@/app/containers/ReviewsContainer/Components/StarRating";

const PRODUCT_RATING_DISTRIBUTION = [
  { star: "5", pct: 72 },
  { star: "4", pct: 16 },
  { star: "3", pct: 7 },
  { star: "2", pct: 3 },
  { star: "1", pct: 2 },
];

const PRODUCT_REVIEWS = [
  {
    id: "pr1",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarBg: "bg-purple-100",
    avatarFg: "text-purple-700",
    rating: 5,
    verified: true,
    date: "May 12, 2025",
    title: "Total game changer for my Labrador!",
    body: "My Labrador has sensitive skin and this food was a game changer. Her coat is finally shiny again and she's so much more energetic.",
    photos: [],
  },
  {
    id: "pr2",
    name: "Mark Thompson",
    initials: "MT",
    avatarBg: "bg-blue-100",
    avatarFg: "text-blue-700",
    rating: 4,
    verified: true,
    date: "Apr 28, 2025",
    title: "Great quality, wish it came in larger bags",
    body: "Great quality, though I wish it came in even larger bags. My Husky loves the taste and finishes it in no time.",
    photos: [],
  },
  {
    id: "pr3",
    name: "Emily Chen",
    initials: "EC",
    avatarBg: "bg-green-100",
    avatarFg: "text-green-700",
    rating: 5,
    verified: true,
    date: "Apr 10, 2025",
    title: "Premium packaging, premium results",
    body: "Excellent delivery speed and the packaging is so premium. Worth every penny for my rescue dog. Will keep ordering.",
    photos: [],
  },
];

export default function ProductDetailsContainer({ productId }) {
  const {
    product,
    gallery,
    activeImage,
    setActiveImage,
    sizes,
    selectedSize,
    setSelectedSize,
    quantity,
    incrementQuantity,
    decrementQuantity,
    activeTab,
    setActiveTab,
    checkedBundleItems,
    toggleBundleItem,
    bundleTotal,
    bundleItems,
    handleAddToCart,
    handleBuyNow,
    handleAddBundleToCart,
    addedToCartSuccess,
    removeFromCart,
  } = useProductDetails(productId);

  const [inCart, setInCart] = useState(false);

  const [helpfulCounts, setHelpfulCounts] = useState({ pr1: 17, pr2: 9, pr3: 24 });
  const [votedIds, setVotedIds] = useState(new Set());

  const toggleHelpful = (id) => {
    const isVoted = votedIds.has(id);
    setVotedIds((prev) => {
      const next = new Set(prev);
      isVoted ? next.delete(id) : next.add(id);
      return next;
    });
    setHelpfulCounts((c) => ({ ...c, [id]: c[id] + (isVoted ? -1 : 1) }));
  };

  // Helper to get estimated delivery date range
  const getDeliveryDateString = () => {
    const options = { month: "long", day: "numeric" };
    const date1 = new Date();
    date1.setDate(date1.getDate() + 2); // 2 days from now
    const date2 = new Date();
    date2.setDate(date2.getDate() + 4); // 4 days from now
    return `${date1.toLocaleDateString("en-US", options)} - ${date2.toLocaleDateString("en-US", options)}`;
  };

  // Calculate discount percentage if MRP exists
  const discountPercent = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-1.5 text-on-surface-variant mb-stack-md text-xs select-none">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/marketplace" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="capitalize">{product.category || "Dogs"}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            {/* Main Image View */}
            <div className="flex-1 zoom-area relative aspect-square bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden group">
              <img
                alt={product.name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 ease-out group-hover:scale-150 cursor-zoom-in"
                src={activeImage || product.image}
              />
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-h-[500px]">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white active:scale-95 transition-all cursor-pointer ${
                    activeImage === img
                      ? "border-2 border-primary shadow-sm"
                      : "border border-outline-variant/30 hover:border-primary"
                  }`}
                >
                  <img
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                    src={img}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="space-y-2">
              <span className="inline-block bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.badge || "Best Seller"}
              </span>
              
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-extrabold leading-tight">
                {product.name}
              </h1>

              {/* Star Rating summary */}
              <div className="flex items-center space-x-2 select-none flex-wrap gap-y-1">
                <StarRating rating={product.rating || 4.8} size={14} />
                <span className="text-xs text-on-surface-variant font-medium">
                  {product.rating || 4.8}
                </span>
                <Link
                  href="/reviews"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  ({product.reviewsCount || "2,451"} reviews)
                </Link>
                <span className="text-outline-variant/60">·</span>
                <Link
                  href="/reviews"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
                >
                  See all reviews
                  <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>
                    chevron_right
                  </span>
                </Link>
              </div>
            </div>

            {/* Pricing and Cart Box */}
            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
              <div className="flex items-baseline flex-wrap gap-2.5">
                <span className="text-2xl md:text-3xl font-extrabold text-primary">
                  {fmt(product.price)}
                </span>
                {product.mrp && (
                  <span className="text-sm text-on-surface-variant line-through font-medium">
                    {fmt(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Delivery Estimation */}
              <div className="flex items-center space-x-2 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-green-600 text-base">local_shipping</span>
                <span>
                  Estimated Delivery: <span className="text-on-surface font-bold">{getDeliveryDateString()}</span>
                </span>
              </div>

              {/* Size Select Button Group */}
              <div className="pt-3 border-t border-outline-variant/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                  <span>Select Size:</span>
                  <span className="text-primary">{selectedSize}</span>
                </div>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                        selectedSize === size
                          ? "border-2 border-primary bg-primary/5 text-primary"
                          : "border-outline hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 items-stretch">
                {inCart ? (
                  /* Quantity stepper — replaces Add to Cart after first click */
                  <div className="flex items-center justify-between bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-lg h-9 flex-1 select-none">
                    <button
                      onClick={() => {
                        if (quantity === 1) {
                          removeFromCart(product.id);
                          setInCart(false);
                        } else {
                          decrementQuantity();
                        }
                      }}
                      className={`px-3 h-full transition-colors cursor-pointer border-none outline-none flex items-center justify-center ${
                        quantity === 1
                          ? "text-error"
                          : "text-on-surface-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {quantity === 1 ? "delete" : "remove"}
                      </span>
                    </button>
                    <span className="font-bold text-on-surface w-6 text-center text-xs">{quantity}</span>
                    <button
                      onClick={() => { incrementQuantity(); handleAddToCart(); }}
                      className="px-3 h-full hover:bg-surface-container-low transition-colors cursor-pointer border-none outline-none text-on-surface-variant flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                ) : (
                  /* Add to Cart — shown only before first click */
                  <button
                    onClick={() => { handleAddToCart(); setInCart(true); }}
                    className="flex-1 h-9 rounded-full font-semibold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border-none hover:shadow-md bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
                  >
                    <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>add_shopping_cart</span>
                    Add to Cart
                  </button>
                )}

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-on-primary h-9 rounded-lg font-bold text-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center border-none outline-none"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Fast Perks */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2.5 p-3 bg-white dark:bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                </div>
                <span className="font-bold text-xs text-on-surface">Grain-Free</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 bg-white dark:bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-base">eco</span>
                </div>
                <span className="font-bold text-xs text-on-surface">100% Organic</span>
              </div>
            </div>

          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        <section className="mt-8">
          <h2 className="text-xs font-bold mb-3 flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">shopping_basket</span>
            Frequently Bought Together
          </h2>

          <div className="bg-surface-container/50 dark:bg-surface-container/30 p-4 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center select-none">
              
              {/* Product Card 1: Current Item */}
              <div className="w-28 h-28 bg-white dark:bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 p-2.5 relative flex items-center justify-center">
                <img
                  alt="Current Item"
                  className="w-full h-full object-contain rounded-lg"
                  src={product.image}
                />
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wider shadow-sm">
                  This Item
                </div>
              </div>
              
              <span className="material-symbols-outlined text-outline text-xl font-bold">add</span>
              
              {/* Product Card 2: Supplement Bundle Sibling */}
              <div
                onClick={() => toggleBundleItem("bundle_supp")}
                className={`w-28 h-28 bg-white dark:bg-surface-container-lowest rounded-xl shadow-xs border p-2.5 relative flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                  checkedBundleItems.bundle_supp ? "border-primary" : "border-outline-variant/30"
                }`}
              >
                <img
                  alt={bundleItems[0].name}
                  className="w-full h-full object-contain rounded-lg"
                  src={bundleItems[0].image}
                />
                <div className="absolute top-1.5 right-1.5">
                  <span className={`material-symbols-outlined text-base ${
                    checkedBundleItems.bundle_supp ? "text-primary fill-1" : "text-outline-variant/60"
                  }`}>
                    {checkedBundleItems.bundle_supp ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center bg-black/60 text-white text-[9px] rounded py-0.5 font-bold">
                  +{fmt(bundleItems[0].price)}
                </div>
              </div>

              <span className="material-symbols-outlined text-outline text-xl font-bold">add</span>

              {/* Product Card 3: Bowl Bundle Sibling */}
              <div
                onClick={() => toggleBundleItem("bundle_bowl")}
                className={`w-28 h-28 bg-white dark:bg-surface-container-lowest rounded-xl shadow-xs border p-2.5 relative flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                  checkedBundleItems.bundle_bowl ? "border-primary" : "border-outline-variant/30"
                }`}
              >
                <img
                  alt={bundleItems[1].name}
                  className="w-full h-full object-contain rounded-lg"
                  src={bundleItems[1].image}
                />
                <div className="absolute top-1.5 right-1.5">
                  <span className={`material-symbols-outlined text-base ${
                    checkedBundleItems.bundle_bowl ? "text-primary fill-1" : "text-outline-variant/60"
                  }`}>
                    {checkedBundleItems.bundle_bowl ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center bg-black/60 text-white text-[9px] rounded py-0.5 font-bold">
                  +{fmt(bundleItems[1].price)}
                </div>
              </div>

            </div>

            {/* Bundle Total Calculator Box */}
            <div className="md:border-l border-outline-variant/30 md:pl-5 flex flex-col items-center md:items-start space-y-2">
              <span className="text-on-surface-variant text-xs font-semibold">Total for items:</span>
              <span className="text-sm font-black text-on-surface">{fmt(bundleTotal)}</span>
              <button
                onClick={handleAddBundleToCart}
                className="bg-primary text-on-primary text-xs px-4 py-2 rounded-full font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer border-none outline-none"
              >
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </section>

        {/* Tabbed Detailed Content */}
        <section className="mt-8">
          {/* Tab Headers */}
          <div className="flex border-b border-outline-variant/30 mb-4 select-none overflow-x-auto">
            {["Specifications", "Nutrition Guide", "Sourcing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">

            {/* Left Pane: Detail Values Table */}
            <div className="bg-white dark:bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-on-surface mb-1">Product Specifications</h3>
              
              {activeTab === "Specifications" && (
                <div className="space-y-2.5">
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Primary Protein</span>
                    <span className="text-on-surface font-bold">
                      {product.brand === "Royal Canin" ? "Dehydrated Poultry Protein" : "Fresh Wild Salmon"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Dietary Requirement</span>
                    <span className="text-on-surface font-bold">
                      {product.brand === "Royal Canin" ? "Enriched Formula" : "Grain-Free, Hypoallergenic"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Age Range</span>
                    <span className="text-on-surface font-bold">
                      {product.name.toLowerCase().includes("puppy") ? "Puppy (2-12 months)" : "Adult (1-7 years)"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Bag Weight</span>
                    <span className="text-on-surface font-bold">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Country of Origin</span>
                    <span className="text-on-surface font-bold">Made in India</span>
                  </div>
                </div>
              )}

              {activeTab === "Nutrition Guide" && (
                <div className="space-y-2.5">
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Crude Protein (Min)</span>
                    <span className="text-on-surface font-bold">34.0%</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Crude Fat (Min)</span>
                    <span className="text-on-surface font-bold">16.0%</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Crude Fiber (Max)</span>
                    <span className="text-on-surface font-bold">4.0%</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Omega-3 Fatty Acids</span>
                    <span className="text-on-surface font-bold">1.2%</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                    <span className="text-on-surface-variant">Omega-6 Fatty Acids</span>
                    <span className="text-on-surface font-bold">2.8%</span>
                  </div>
                </div>
              )}

              {activeTab === "Sourcing" && (
                <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <p>
                    Our ingredients are responsibly sourced from audited farms and sustainable fisheries.
                  </p>
                  <p>
                    All raw organic salmon is caught off the coast of sustainable wild waters, transported in deep temperature-controlled units, and mixed with fresh kale picked from local domestic greenhouses within 24 hours of harvest.
                  </p>
                  <p className="font-bold text-on-surface">
                    100% Traceable supply chain from farm to bowl.
                  </p>
                </div>
              )}
            </div>

            {/* Right Pane: Key Benefits List */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-on-surface">Key Benefits</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-600 mt-0.5 text-base">check_circle</span>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Shiny Coat &amp; Healthy Skin</h4>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">High concentration of active Omega-3 fatty acids for structural fur and skin glow.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-600 mt-0.5 text-base">check_circle</span>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Digestive Support</h4>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">Infused with prebiotic vegetable fibers from clean kale and green field spinach.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-600 mt-0.5 text-base">check_circle</span>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Immune Boosting</h4>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">Packed with antioxidants from fresh organic berries and leafy vegetables.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Customer Reviews — same components as ServiceDetailsContainer */}
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 gap-3">
            <div>
              <h2 className="text-xs font-bold text-on-surface">Community Stories</h2>
              <p className="text-on-surface-variant text-xs">See what other pet parents are saying</p>
            </div>
            <button className="bg-white dark:bg-surface-container-lowest border-2 border-primary text-primary font-bold text-xs px-4 py-1.5 rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer self-start sm:self-auto">
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <aside className="lg:col-span-4">
              <RatingSummary product={{ ...product, ratingDistribution: PRODUCT_RATING_DISTRIBUTION }} />
            </aside>

            <div className="lg:col-span-8 space-y-4">
              {PRODUCT_REVIEWS.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  helpfulCount={helpfulCounts[review.id]}
                  isVoted={votedIds.has(review.id)}
                  onHelpful={() => toggleHelpful(review.id)}
                />
              ))}

              <div className="flex justify-center pt-2">
                <Link href="/reviews" className="text-primary font-bold text-xs hover:underline flex items-center gap-0.5">
                  View All Reviews
                  <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
