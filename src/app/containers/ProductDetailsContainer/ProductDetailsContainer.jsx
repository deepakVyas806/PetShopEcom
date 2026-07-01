"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useProductDetails from "./ProductDetailsContainer.hook";
import {
  IconChevronRight, IconShipping, IconCartSimple, IconDelete,
  IconRemove, IconAdd, IconShield, IconEco, IconBag, IconCheckCircle,
  IconTag, IconLocation, IconLightning, IconCopy, IconVerified,
  IconStar, IconPackage,
} from "@/lib/icons";
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
    <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-outline-variant/20 bg-surface-container/40">
        <IconTag size={13} className="text-primary" weight="fill" />
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
                  <><span>{o.code}</span><IconCopy size={10} weight="regular" /></>
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
    const fast = ["4", "5"].includes(pin[0]);
    setResult(fast
      ? { ok: true, msg: "Delivery by Tomorrow, 10am – 6pm" }
      : { ok: true, msg: "Delivery in 3–5 business days" });
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
          className="flex-1 border border-outline-variant/40 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary text-on-surface bg-surface-container-lowest placeholder:text-on-surface-variant/50"
        />
        <button
          onClick={checkPin}
          disabled={pin.length !== 6}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl disabled:opacity-40 cursor-pointer border-none transition-opacity"
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

  const getDeliveryDateString = () => {
    const options = { month: "short", day: "numeric" };
    const d1 = new Date(); d1.setDate(d1.getDate() + 2);
    const d2 = new Date(); d2.setDate(d2.getDate() + 4);
    return `${d1.toLocaleDateString("en-US", options)} – ${d2.toLocaleDateString("en-US", options)}`;
  };

  if (loading || !product) {
    return (
      <div className="w-full bg-background">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 aspect-square rounded-2xl animate-shimmer" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-5 w-24 rounded-full animate-shimmer" />
              <div className="h-8 w-3/4 rounded-xl animate-shimmer" />
              <div className="h-4 w-1/3 rounded-xl animate-shimmer" />
              <div className="h-32 rounded-xl animate-shimmer" />
              <div className="h-10 rounded-xl animate-shimmer" />
              <div className="h-10 rounded-xl animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discountPercent = product.mrp && product.mrp > displayPrice
    ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
    : 0;

  const savings = product.mrp && product.mrp > displayPrice ? product.mrp - displayPrice : 0;

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      {/* Extra bottom padding on mobile so content clears the sticky CTA bar + mobile nav */}
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4 md:py-stack-lg pb-[140px] md:pb-stack-lg">

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center flex-wrap gap-1.5 text-on-surface-variant mb-5 text-xs select-none">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <IconChevronRight size={12} weight="regular" />
          <Link href="/marketplace" className="hover:text-primary transition-colors">Shop</Link>
          <IconChevronRight size={12} weight="regular" />
          <span className="capitalize">{product.category || "Dogs"}</span>
          <IconChevronRight size={12} weight="regular" />
          <span className="text-primary font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Mobile breadcrumb — compact */}
        <nav className="md:hidden flex items-center gap-1 text-on-surface-variant mb-3 text-[11px] select-none">
          <Link href="/marketplace" className="hover:text-primary transition-colors flex items-center gap-0.5">
            <IconChevronRight size={11} weight="regular" className="rotate-180" />
            Shop
          </Link>
          <IconChevronRight size={11} weight="regular" />
          <span className="text-on-surface truncate max-w-[200px] font-medium">{product.name}</span>
        </nav>

        {/* ── Product Hero ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-gutter">

          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            {/* Desktop: side-by-side thumbnails + main image */}
            <div className="hidden md:flex flex-row-reverse gap-3 h-[480px] lg:h-[540px]">
              {/* Main image */}
              <div className="flex-1 relative bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden group shadow-card-sm">
                {(activeImage || product.image) && (
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 cursor-zoom-in"
                    src={activeImage || product.image}
                  />
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-error text-on-error text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
                <span className="absolute bottom-3 right-3 text-[9px] text-white/60 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm select-none">
                  Hover to zoom
                </span>
              </div>
              {/* Thumbnail column */}
              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide w-[72px]">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-full aspect-square flex-shrink-0 rounded-xl overflow-hidden active:scale-95 transition-all cursor-pointer ${
                      activeImage === img
                        ? "ring-2 ring-primary ring-offset-1 shadow-sm"
                        : "border border-outline-variant/30 hover:border-primary/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" src={img} />
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: stacked — main image then horizontal thumb strip */}
            <div className="md:hidden space-y-2.5">
              <div className="relative w-full aspect-square bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden shadow-card-sm">
                {(activeImage || product.image) && (
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover"
                    src={activeImage || product.image}
                  />
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-error text-on-error text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              {/* Horizontal thumbnail strip */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden active:scale-95 transition-all cursor-pointer ${
                        activeImage === img
                          ? "ring-2 ring-primary ring-offset-1"
                          : "border border-outline-variant/30 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" src={img} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Badge + title + rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {product.badge || "Best Seller"}
                </span>
                {product.brand && (
                  <span className="text-[10px] text-on-surface-variant font-medium">{product.brand}</span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-extrabold text-on-surface leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.reviewsCount > 0 ? (
                  <>
                    <StarRating rating={product.rating} size={13} />
                    <span className="text-xs font-bold text-on-surface">{product.rating}</span>
                    <span className="text-xs text-on-surface-variant">({product.reviewsCount})</span>
                    <span className="text-outline-variant/50">·</span>
                    <button
                      onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5 bg-transparent border-none cursor-pointer p-0"
                    >
                      See reviews <IconChevronRight size={12} weight="regular" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-on-surface-variant">No reviews yet</span>
                )}
              </div>

              {/* Short description if available */}
              {product.description && (
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Urgency signals */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.stock != null && product.stock <= 5 && (
                <span className="flex items-center gap-1 text-xs font-bold text-error bg-error/10 border border-error/20 px-2.5 py-1 rounded-full">
                  <IconLightning size={11} weight="fill" />
                  Only {product.stock} left!
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {Math.floor(12 + (product._id?.charCodeAt(0) ?? 3) % 19)} viewing now
              </span>
            </div>

            {/* ── Pricing + Cart box ─────────────────────────────────── */}
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">

              {/* Price row */}
              <div className="px-4 pt-4 pb-3 border-b border-outline-variant/10">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-2xl md:text-3xl font-black text-on-surface">
                    {fmt(displayPrice)}
                  </span>
                  {product.mrp && product.mrp > displayPrice && (
                    <span className="text-sm text-on-surface-variant line-through">
                      {fmt(product.mrp)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                      {discountPercent}% off
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-xs text-green-600 font-semibold mt-0.5">
                    You save {fmt(savings)}
                  </p>
                )}
              </div>

              <div className="px-4 py-3 space-y-3.5">
                {/* Delivery info */}
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <IconShipping size={15} className="text-green-600 shrink-0" weight="regular" />
                  <span>
                    Free delivery by{" "}
                    <span className="font-bold text-on-surface">{getDeliveryDateString()}</span>
                  </span>
                </div>

                {/* Size selector */}
                {sizes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                      <span>Size</span>
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
                              : "border-outline-variant/50 hover:bg-surface-container-high text-on-surface"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA buttons — DESKTOP ONLY (hidden on mobile, shown in sticky bar) */}
                <div className="hidden md:flex flex-col gap-2 pt-1">
                  {inCart ? (
                    <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 rounded-xl h-10 select-none">
                      <button
                        onClick={() => {
                          if (quantity === 1) { removeFromCart(product._id ?? product.id); setInCart(false); }
                          else decrementQuantity();
                        }}
                        className={`px-4 h-full transition-colors cursor-pointer border-none outline-none flex items-center justify-center rounded-l-xl ${
                          quantity === 1 ? "text-error" : "text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        {quantity === 1 ? <IconDelete size={15} weight="regular" /> : <IconRemove size={15} weight="regular" />}
                      </button>
                      <span className="font-bold text-on-surface w-8 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => { incrementQuantity(); handleAddToCart(); }}
                        className="px-4 h-full hover:bg-surface-container-low transition-colors cursor-pointer border-none outline-none text-on-surface-variant flex items-center justify-center rounded-r-xl"
                      >
                        <IconAdd size={15} weight="regular" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { handleAddToCart(); setInCart(true); }}
                      className="w-full h-10 rounded-xl font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-primary bg-primary/5 text-primary hover:bg-primary hover:text-on-primary"
                    >
                      <IconCartSimple size={15} weight="bold" />
                      Add to Cart
                    </button>
                  )}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-primary text-on-primary h-10 rounded-xl font-bold text-xs hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center border-none shadow-brand-sm"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Mobile hint — tells user buttons are at bottom */}
                <p className="md:hidden text-[11px] text-on-surface-variant text-center py-0.5">
                  Add to Cart & Buy Now are pinned below ↓
                </p>
              </div>
            </div>

            {/* Trust perks */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { Icon: IconShield,   label: "Grain-Free",      sub: "No fillers"       },
                { Icon: IconEco,      label: "100% Organic",    sub: "Vet approved"     },
                { Icon: IconVerified, label: "Genuine Product",  sub: "Quality assured"  },
                { Icon: IconShipping, label: "Free Delivery",    sub: "On all orders"    },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card-sm">
                  <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-primary" weight="regular" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface leading-none">{label}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Available Offers */}
            <OffersSection coupons={coupons} />

            {/* Delivery Pincode Check */}
            <DeliveryCheck />

          </div>
        </div>

        {/* ── Frequently Bought Together ─────────────────────────────────── */}
        {bundleItems.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-bold mb-3 flex items-center gap-1.5 text-on-surface">
              <IconBag size={16} className="text-primary" weight="regular" />
              Frequently Bought Together
            </h2>
            <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row items-center justify-center gap-5">
              <div className="flex items-center gap-3 flex-wrap justify-center select-none">
                {/* Current product */}
                <div className="w-24 h-24 md:w-28 md:h-28 bg-surface-container-lowest rounded-xl shadow-card-sm border border-outline-variant/30 p-2 relative flex items-center justify-center">
                  {product.image && (
                    <img alt="Current Item" className="w-full h-full object-contain rounded-lg" src={product.image} />
                  )}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                    This Item
                  </div>
                </div>

                {bundleItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <IconAdd size={18} className="text-outline-variant" weight="bold" />
                    <div
                      onClick={() => toggleBundleItem(item.id)}
                      className={`w-24 h-24 md:w-28 md:h-28 bg-surface-container-lowest rounded-xl shadow-card-sm border p-2 relative flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        checkedBundleItems[item.id] ? "border-primary border-2" : "border-outline-variant/30"
                      }`}
                    >
                      {item.image && (
                        <img alt={item.name} className="w-full h-full object-contain rounded-lg" src={item.image} />
                      )}
                      <div className="absolute top-1.5 right-1.5">
                        <IconCheckCircle size={16} weight={checkedBundleItems[item.id] ? "fill" : "regular"} className={checkedBundleItems[item.id] ? "text-primary" : "text-outline-variant/50"} />
                      </div>
                      <div className="absolute bottom-1.5 left-1 right-1 text-center bg-black/60 text-white text-[9px] rounded py-0.5 font-bold">
                        +{fmt(item.price)}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="md:border-l border-outline-variant/30 md:pl-5 flex flex-col items-center md:items-start gap-2">
                <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wide">Bundle Total</span>
                <span className="text-lg font-black text-on-surface">{fmt(bundleTotal)}</span>
                <button
                  onClick={handleAddBundleToCart}
                  className="bg-primary text-on-primary text-xs px-5 py-2 rounded-full font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer border-none"
                >
                  Add Bundle to Cart
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── Tabs: Specs / Nutrition / Sourcing ─────────────────────────── */}
        <section className="mt-8">
          <div className="flex border-b border-outline-variant/30 mb-4 select-none overflow-x-auto">
            {["Specifications", "Nutrition Guide", "Sourcing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Specs table */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-card-sm space-y-3">
              <h3 className="text-xs font-bold text-on-surface">Product Specifications</h3>

              {activeTab === "Specifications" && (
                <div className="space-y-2.5">
                  {[
                    { label: "Brand",        value: product.brand },
                    { label: "Category",     value: product.category },
                    { label: "Life Stage",   value: product.lifeStage || "All Stages" },
                    { label: "Pet Type",     value: product.petTypes?.join(", ") || "—" },
                    { label: "Weight",       value: product.weight || selectedSize || "—" },
                    { label: "Stock Status", value: product.status || "In Stock" },
                    { label: "SKU",          value: product.sku || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-outline-variant/10 pb-2 text-xs">
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
                        <div key={label} className="flex justify-between border-b border-outline-variant/10 pb-2 text-xs">
                          <span className="text-on-surface-variant">{label}</span>
                          <span className="text-on-surface font-bold">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant">Nutrition info not applicable for this product.</p>
                  );
                })()
              )}

              {activeTab === "Sourcing" && (
                <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                  {product.sourcing ? (
                    product.sourcing.split("\n").filter(Boolean).map((para, i, arr) => (
                      <p key={i} className={i === arr.length - 1 ? "font-bold text-on-surface" : ""}>{para}</p>
                    ))
                  ) : (
                    <p>Sourcing information is not available for this product.</p>
                  )}
                </div>
              )}
            </div>

            {/* Right: Key benefits */}
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 shadow-card-sm space-y-3">
              <h3 className="text-xs font-bold text-on-surface">Key Benefits</h3>
              <ul className="space-y-2.5">
                {(product.bullets?.length > 0
                  ? product.bullets
                  : ["Premium quality ingredients", "Vet recommended formula", "No artificial additives"]
                ).map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <IconCheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" weight="fill" />
                    <span className="text-xs text-on-surface leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Customer Reviews ───────────────────────────────────────────── */}
        <section id="reviews-section" className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div>
              <h2 className="text-sm font-bold text-on-surface">Community Stories</h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5">See what other pet parents are saying</p>
            </div>
            <button
              onClick={() => setReviewFormOpen((o) => !o)}
              className="self-start sm:self-auto bg-surface-container-lowest border-2 border-primary text-primary font-bold text-xs px-4 py-1.5 rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
            >
              {reviewFormOpen ? "Cancel" : "Write a Review"}
            </button>
          </div>

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
                    <div key={i} className="h-28 rounded-2xl animate-shimmer" />
                  ))}
                </div>
              )}
              {!reviewsLoading && reviews.length === 0 && (
                <p className="text-xs text-on-surface-variant py-8 text-center">No reviews yet — be the first!</p>
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
                    View All Reviews <IconChevronRight size={14} weight="regular" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* ── Sticky mobile CTA bar — sits above MobileFooter (58px) ─────── */}
      <div className="fixed bottom-[58px] left-0 right-0 z-40 md:hidden bg-surface-container-lowest border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]">
        {/* Price strip */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="min-w-0 shrink-0">
            <p className="text-base font-black text-on-surface leading-none">{fmt(displayPrice)}</p>
            {discountPercent > 0 && (
              <p className="text-[10px] text-green-600 font-bold mt-0.5">{discountPercent}% off · Save {fmt(savings)}</p>
            )}
          </div>

          <div className="flex-1 flex gap-2">
            {inCart ? (
              /* Quantity stepper when already in cart */
              <>
                <div className="flex items-center bg-surface-container border border-outline-variant/30 rounded-xl h-10 select-none">
                  <button
                    onClick={() => {
                      if (quantity === 1) { removeFromCart(product._id ?? product.id); setInCart(false); }
                      else decrementQuantity();
                    }}
                    className={`px-3 h-full flex items-center justify-center cursor-pointer border-none bg-transparent rounded-l-xl ${
                      quantity === 1 ? "text-error" : "text-on-surface-variant"
                    }`}
                  >
                    {quantity === 1 ? <IconDelete size={14} weight="regular" /> : <IconRemove size={14} weight="regular" />}
                  </button>
                  <span className="font-bold text-on-surface w-7 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => { incrementQuantity(); handleAddToCart(); }}
                    className="px-3 h-full flex items-center justify-center cursor-pointer border-none bg-transparent text-on-surface-variant rounded-r-xl"
                  >
                    <IconAdd size={14} weight="regular" />
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-on-primary font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer border-none shadow-brand-sm"
                >
                  Buy Now
                </button>
              </>
            ) : (
              /* Initial state — two full buttons */
              <>
                <button
                  onClick={() => { handleAddToCart(); setInCart(true); }}
                  className="flex-1 bg-primary/10 text-primary border border-primary/30 font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-on-primary font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer border-none shadow-brand-sm"
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
