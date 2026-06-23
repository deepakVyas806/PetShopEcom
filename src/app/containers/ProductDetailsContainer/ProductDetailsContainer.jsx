"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useProductDetails from "./ProductDetailsContainer.hook";
import { IconChevronRight, IconShipping, IconCartSimple, IconDelete, IconRemove, IconAdd, IconShield, IconEco, IconBag, IconCheckCircle, IconChevronDown, IconTag, IconLocation, IconLightning, IconCopy } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import ReviewCard from "@/app/containers/ReviewsContainer/Components/ReviewCard";
import RatingSummary from "@/app/containers/ReviewsContainer/Components/RatingSummary";
import StarRating from "@/app/containers/ReviewsContainer/Components/StarRating";
import InlineReviewForm from "@/components/common/InlineReviewForm";

const AVATAR_COLORS = [
  ["bg-purple-100", "text-purple-700"],
  ["bg-blue-100",   "text-blue-700"],
  ["bg-green-100",  "text-green-700"],
  ["bg-orange-100", "text-orange-700"],
  ["bg-rose-100",   "text-rose-700"],
];

function transformReview(r, idx) {
  const words = (r.name || "AN").trim().split(/\s+/);
  const initials = ((words[0]?.[0] ?? "A") + (words[1]?.[0] ?? "N")).toUpperCase();
  const [avatarBg, avatarFg] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return {
    ...r,
    id: r._id ?? r.id,
    initials,
    avatarBg,
    avatarFg,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : (r.date ?? ""),
  };
}

function OffersSection({ coupons = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(null);

  function copyCode(code) {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1800);
  }

  if (coupons.length === 0) return null;

  const visible = expanded ? coupons : coupons.slice(0, 2);

  return (
    <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-white dark:bg-surface-container-lowest">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-outline-variant/20 bg-surface-container/40">
        <IconTag size={14} className="text-primary" weight="fill" />
        <span className="text-xs font-bold text-on-surface">Available Offers</span>
      </div>
      <div className="divide-y divide-outline-variant/10">
        {visible.map((o) => {
          const desc = o.description ||
            (o.discountType === "percent"
              ? `${o.value}% off${o.minOrder > 0 ? ` on orders above ₹${o.minOrder}` : ""}`
              : `Flat ₹${o.value} off${o.minOrder > 0 ? ` on orders above ₹${o.minOrder}` : ""}`);
          return (
            <div key={o.code} className="flex items-start gap-3 px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-on-surface leading-snug">{desc}</p>
                {o.endDate && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    Valid till {new Date(o.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
              <button
                onClick={() => copyCode(o.code)}
                className="shrink-0 flex items-center gap-1 border border-dashed border-primary/50 text-primary text-[10px] font-bold px-2 py-1 rounded cursor-pointer bg-transparent hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                {copied === o.code ? "✓ Copied!" : (
                  <>
                    <span>{o.code}</span>
                    <IconCopy size={10} weight="regular" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      {coupons.length > 2 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-[10px] text-primary font-semibold py-2 hover:bg-surface-container/40 transition-colors cursor-pointer border-none bg-transparent"
        >
          {expanded ? "Show less" : `+${coupons.length - 2} more offers`}
        </button>
      )}
    </div>
  );
}

function DeliveryCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);

  function checkPin() {
    if (pin.length !== 6) return;
    // Simulate: pins starting with 4 or 5 = fast delivery, otherwise standard
    const fast = ["4", "5"].includes(pin[0]);
    setResult(fast
      ? { ok: true,  msg: "Delivery by Tomorrow, 10am – 6pm" }
      : { ok: true,  msg: "Delivery in 3–5 business days" });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-on-surface flex items-center gap-1.5">
        <IconLocation size={13} className="text-primary" weight="fill" />
        Check delivery to your pincode
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setResult(null); }}
          placeholder="Enter 6-digit pincode"
          className="flex-1 border border-outline-variant/40 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary text-on-surface bg-white dark:bg-surface-container-lowest placeholder:text-on-surface-variant/50"
        />
        <button
          onClick={checkPin}
          disabled={pin.length !== 6}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg disabled:opacity-40 cursor-pointer border-none transition-opacity"
        >
          Check
        </button>
      </div>
      {result && (
        <p className={`text-xs font-medium flex items-center gap-1 ${result.ok ? "text-green-600" : "text-red-500"}`}>
          <IconShipping size={13} weight="fill" />
          {result.msg}
        </p>
      )}
    </div>
  );
}

export default function ProductDetailsContainer({ productId }) {
  const {
    product,
    loading,
    ratingDistribution,
    apiReviews,
    reviewsLoading,
    gallery,
    activeImage,
    setActiveImage,
    sizes,
    selectedSize,
    setSelectedSize,
    displayPrice,
    quantity,
    incrementQuantity,
    decrementQuantity,
    activeTab,
    setActiveTab,
    checkedBundleItems,
    toggleBundleItem,
    bundleTotal,
    bundleItems,
    coupons,
    handleAddToCart,
    handleBuyNow,
    handleAddBundleToCart,
    addedToCartSuccess,
    removeFromCart,
  } = useProductDetails(productId);

  const [inCart, setInCart] = useState(false);

  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [votedIds, setVotedIds] = useState(new Set());

  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Populate reviews from API data
  useEffect(() => {
    if (!apiReviews.length) return;
    const transformed = apiReviews.map(transformReview);
    setReviews(transformed);
    const counts = {};
    transformed.forEach(r => { counts[r.id] = r.helpfulCount ?? 0; });
    setHelpfulCounts(counts);
  }, [apiReviews]);

  const handleSubmitReview = ({ rating, title, body }) => {
    const newReview = {
      id: `pr-${Date.now()}`,
      name: "You", initials: "YO",
      avatarBg: "bg-purple-100", avatarFg: "text-purple-700",
      rating, verified: true,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      title, body, photos: [],
    };
    setReviews((prev) => [newReview, ...prev]);
    setHelpfulCounts((c) => ({ ...c, [newReview.id]: 0 }));
    setReviewFormOpen(false);
  };

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

  if (loading || !product) {
    return (
      <div className="w-full bg-background">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter animate-pulse">
            <div className="lg:col-span-7 aspect-square rounded-2xl bg-surface-container-low" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 w-2/3 rounded bg-surface-container-low" />
              <div className="h-4 w-1/2 rounded bg-surface-container-low" />
              <div className="h-10 w-1/3 rounded bg-surface-container-low" />
              <div className="h-12 rounded-xl bg-surface-container-low" />
              <div className="h-12 rounded-xl bg-surface-container-low" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discountPercent = product.mrp && product.mrp > displayPrice
    ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
    : 0;

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-1.5 text-on-surface-variant mb-stack-md text-xs select-none">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <IconChevronRight size={14} weight="regular" />
          <Link href="/marketplace" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <IconChevronRight size={14} weight="regular" />
          <span className="capitalize">{product.category || "Dogs"}</span>
          <IconChevronRight size={14} weight="regular" />
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
                {product.reviewsCount > 0 ? (
                  <>
                    <StarRating rating={product.rating} size={14} />
                    <span className="text-xs text-on-surface-variant font-medium">
                      {product.rating}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      ({product.reviewsCount} reviews)
                    </span>
                    <span className="text-outline-variant/60">·</span>
                    <button
                      onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5 bg-transparent border-none cursor-pointer p-0"
                    >
                      See all reviews
                      <IconChevronRight size={14} className="leading-none" weight="regular" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-on-surface-variant">No reviews yet</span>
                )}
              </div>
            </div>

            {/* Urgency signals */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.stock != null && product.stock <= 5 && (
                <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                  <IconLightning size={12} weight="fill" />
                  Only {product.stock} left in stock!
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {Math.floor(12 + (product._id?.charCodeAt(0) ?? 3) % 19)} people viewing this now
              </span>
            </div>

            {/* Pricing and Cart Box */}
            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
              <div className="flex items-baseline flex-wrap gap-2.5">
                <span className="text-2xl md:text-3xl font-extrabold text-on-surface">
                  {fmt(displayPrice)}
                </span>
                {product.mrp && (
                  <span className="text-sm text-on-surface-variant line-through font-medium">
                    {fmt(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                    {discountPercent}% off
                  </span>
                )}
              </div>

              {/* Delivery Estimation */}
              <div className="flex items-center space-x-2 text-on-surface-variant text-xs">
                <IconShipping size={18} className="text-green-600" weight="regular" />
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
                          removeFromCart(product._id ?? product.id);
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
                      {quantity === 1 ? <IconDelete size={16} weight="regular" /> : <IconRemove size={16} weight="regular" />}
                    </button>
                    <span className="font-bold text-on-surface w-6 text-center text-xs">{quantity}</span>
                    <button
                      onClick={() => { incrementQuantity(); handleAddToCart(); }}
                      className="px-3 h-full hover:bg-surface-container-low transition-colors cursor-pointer border-none outline-none text-on-surface-variant flex items-center justify-center"
                    >
                      <IconAdd size={16} weight="regular" />
                    </button>
                  </div>
                ) : (
                  /* Add to Cart — shown only before first click */
                  <button
                    onClick={() => { handleAddToCart(); setInCart(true); }}
                    className="flex-1 h-9 rounded-full font-semibold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border-none hover:shadow-md bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
                  >
                    <IconCartSimple size={16} className="leading-none" weight="bold" />
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
                  <IconShield size={18} className="text-primary" weight="regular" />
                </div>
                <span className="font-bold text-xs text-on-surface">Grain-Free</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 bg-white dark:bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                  <IconEco size={18} className="text-primary" weight="regular" />
                </div>
                <span className="font-bold text-xs text-on-surface">100% Organic</span>
              </div>
            </div>

            {/* Available Offers */}
            <OffersSection coupons={coupons} />

            {/* Delivery Pincode Check */}
            <DeliveryCheck />

          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        {bundleItems.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xs font-bold mb-3 flex items-center gap-1.5 text-on-surface">
              <IconBag size={18} className="text-primary" weight="regular" />
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

                {bundleItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <IconAdd size={20} className="text-outline font-bold" weight="bold" />
                    <div
                      onClick={() => toggleBundleItem(item.id)}
                      className={`w-28 h-28 bg-white dark:bg-surface-container-lowest rounded-xl shadow-xs border p-2.5 relative flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        checkedBundleItems[item.id] ? "border-primary" : "border-outline-variant/30"
                      }`}
                    >
                      <img
                        alt={item.name}
                        className="w-full h-full object-contain rounded-lg"
                        src={item.image}
                      />
                      <div className="absolute top-1.5 right-1.5">
                        <IconCheckCircle size={18} weight={checkedBundleItems[item.id] ? "fill" : "regular"} className={checkedBundleItems[item.id] ? "text-primary" : "text-outline-variant/60"} />
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center bg-black/60 text-white text-[9px] rounded py-0.5 font-bold">
                        +{fmt(item.price)}
                      </div>
                    </div>
                  </React.Fragment>
                ))}

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
        )}

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
                  {[
                    { label: "Brand",          value: product.brand },
                    { label: "Category",       value: product.category },
                    { label: "Life Stage",     value: product.lifeStage || "All Stages" },
                    { label: "Pet Type",       value: product.petTypes?.join(", ") || "—" },
                    { label: "Weight",         value: product.weight || selectedSize || "—" },
                    { label: "Stock Status",   value: product.status || "In Stock" },
                    { label: "SKU",            value: product.sku || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                      <span className="text-on-surface-variant">{label}</span>
                      <span className="text-on-surface font-bold capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Nutrition Guide" && (
                (() => {
                  const nf = product.nutritionFacts;
                  const rows = nf ? [
                    ["Crude Protein (Min)", nf.crudeProtein],
                    ["Crude Fat (Min)",     nf.crudeFat],
                    ["Crude Fiber (Max)",   nf.crudeFiber],
                    ["Omega-3 Fatty Acids", nf.omega3],
                    ["Omega-6 Fatty Acids", nf.omega6],
                    ["Moisture (Max)",      nf.moisture],
                  ].filter(([, v]) => v) : [];
                  return rows.length > 0 ? (
                    <div className="space-y-2.5">
                      {rows.map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                          <span className="text-on-surface-variant">{label}</span>
                          <span className="text-on-surface font-bold">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant">Nutrition information is not applicable for this product.</p>
                  );
                })()
              )}

              {activeTab === "Sourcing" && (
                <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                  {product.sourcing ? (
                    product.sourcing.split("\n").filter(Boolean).map((para, i, arr) => (
                      <p key={i} className={i === arr.length - 1 ? "font-bold text-on-surface" : ""}>
                        {para}
                      </p>
                    ))
                  ) : (
                    <p>Sourcing information is not available for this product.</p>
                  )}
                </div>
              )}
            </div>

            {/* Right Pane: Key Benefits List */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-on-surface">Key Benefits</h3>
              <ul className="space-y-2.5">
                {(product.bullets?.length > 0
                  ? product.bullets
                  : ["Premium quality ingredients", "Vet recommended formula", "No artificial additives"]
                ).map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <IconCheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" weight="regular" />
                    <span className="text-xs text-on-surface leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* Customer Reviews — same components as ServiceDetailsContainer */}
        <section id="reviews-section" className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 gap-3">
            <div>
              <h2 className="text-xs font-bold text-on-surface">Community Stories</h2>
              <p className="text-on-surface-variant text-xs">See what other pet parents are saying</p>
            </div>
            <button
              onClick={() => setReviewFormOpen((o) => !o)}
              className="bg-white dark:bg-surface-container-lowest border-2 border-primary text-primary font-bold text-xs px-4 py-1.5 rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
            >
              {reviewFormOpen ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {/* Inline review form — shared component, primary-colour stars */}
          {reviewFormOpen && (
            <div className="mb-5">
              <InlineReviewForm
                onSubmit={handleSubmitReview}
                onCancel={() => setReviewFormOpen(false)}
                context="product"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <aside className="lg:col-span-4">
              <RatingSummary product={{ ...product, ratingDistribution }} />
            </aside>

            <div className="lg:col-span-8 space-y-4">
              {reviewsLoading && reviews.length === 0 && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-surface-container-low animate-pulse" />
                  ))}
                </div>
              )}
              {!reviewsLoading && reviews.length === 0 && (
                <p className="text-xs text-on-surface-variant py-6 text-center">No reviews yet — be the first to write one!</p>
              )}
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  helpfulCount={helpfulCounts[review.id] ?? 0}
                  isVoted={votedIds.has(review.id)}
                  onHelpful={() => toggleHelpful(review.id)}
                />
              ))}

              {reviews.length > 0 && (
                <div className="flex justify-center pt-2">
                  <Link href="/reviews" className="text-primary font-bold text-xs hover:underline flex items-center gap-0.5">
                    View All Reviews
                    <IconChevronRight size={16} className="leading-none" weight="regular" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden bg-white dark:bg-surface-container-lowest border-t border-outline-variant/20 px-4 py-2.5 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="min-w-0 shrink-0">
          <p className="text-base font-extrabold text-on-surface leading-none">{fmt(displayPrice)}</p>
          {discountPercent > 0 && (
            <p className="text-[10px] text-green-600 font-bold mt-0.5">{discountPercent}% off</p>
          )}
        </div>
        <div className="flex-1 flex gap-2">
          <button
            onClick={() => { handleAddToCart(); setInCart(true); }}
            className="flex-1 bg-primary/10 text-primary border border-primary/30 font-bold text-xs py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-primary text-white font-bold text-xs py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer border-none"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
