"use client";

import React from "react";
import Link from "next/link";
import useProductDetails from "./ProductDetailsContainer.hook";

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
    addedToCartSuccess
  } = useProductDetails(productId);

  // Helper to render star ratings
  const renderStars = (rating, sizeClass = "text-[12px]") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span
            key={i}
            className={`material-symbols-outlined ${sizeClass} text-[#FFB800]`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span
            key={i}
            className={`material-symbols-outlined ${sizeClass} text-[#FFB800]`}
            style={{ fontVariationSettings: "'FILL' 0.5" }}
          >
            star_half
          </span>
        );
      } else {
        stars.push(
          <span
            key={i}
            className={`material-symbols-outlined ${sizeClass} text-[#FFB800]`}
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            star
          </span>
        );
      }
    }
    return stars;
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
                <div className="flex">
                  {renderStars(product.rating || 4.8, "text-[14px]")}
                </div>
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
                  ${product.price.toFixed(2)}
                </span>
                {product.mrp && (
                  <span className="text-sm text-on-surface-variant line-through font-medium">
                    ${product.mrp.toFixed(2)}
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

              {/* Sleek Minimalistic Controls Row */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 items-stretch">
                {/* Quantity Box */}
                <div className="flex items-center justify-between bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-lg h-9 w-full sm:w-24 select-none">
                  <button
                    onClick={decrementQuantity}
                    className="px-2 h-full hover:bg-surface-container-low transition-colors cursor-pointer border-none outline-none text-on-surface-variant flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="font-bold text-on-surface w-6 text-center text-xs">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-2 h-full hover:bg-surface-container-low transition-colors cursor-pointer border-none outline-none text-on-surface-variant flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-9 rounded-full font-semibold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border-none hover:shadow-md ${
                    addedToCartSuccess
                      ? "bg-primary text-on-primary"
                      : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
                  }`}
                >
                  <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>
                    {addedToCartSuccess ? "check" : "add_shopping_cart"}
                  </span>
                  {addedToCartSuccess ? "Added!" : "Add to Cart"}
                </button>

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
        <section className="mt-12">
          <h2 className="font-headline-sm text-headline-sm mb-4 flex items-center gap-1.5 font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">shopping_basket</span>
            Frequently Bought Together
          </h2>
          
          <div className="bg-surface-container/50 dark:bg-surface-container/30 p-5 rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row items-center justify-center gap-6">
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
                  +${bundleItems[0].price.toFixed(2)}
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
                  +${bundleItems[1].price.toFixed(2)}
                </div>
              </div>

            </div>

            {/* Bundle Total Calculator Box */}
            <div className="md:border-l border-outline-variant/30 md:pl-6 flex flex-col items-center md:items-start space-y-2">
              <span className="text-on-surface-variant text-xs font-semibold">
                Total for items:
              </span>
              <span className="text-xl md:text-2xl font-black text-on-surface">
                ${bundleTotal.toFixed(2)}
              </span>
              <button
                onClick={handleAddBundleToCart}
                className="bg-primary text-on-primary text-xs px-6 py-2.5 rounded-full font-bold hover:bg-primary-hover active:scale-95 transition-all shadow-md cursor-pointer border-none outline-none"
              >
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </section>

        {/* Tabbed Detailed Content */}
        <section className="mt-12">
          {/* Tab Headers */}
          <div className="flex border-b border-outline-variant/30 mb-stack-md select-none overflow-x-auto">
            {["Specifications", "Nutrition Guide", "Sourcing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
            <div className="bg-white dark:bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-on-surface mb-2">Product Specifications</h3>
              
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
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-on-surface">Key Benefits</h3>
              
              <ul className="space-y-3.5">
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

        {/* Customer Reviews Panel */}
        <section className="mt-12">
          
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Community Stories</h2>
              <p className="text-on-surface-variant text-xs">See what other pet parents are saying</p>
            </div>
            <button className="bg-white dark:bg-surface-container-lowest border-2 border-primary text-primary font-bold text-xs px-4 py-1.5 rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer">
              Write a Review
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            
            {/* Review Card 1 */}
            <div className="bg-white dark:bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden border border-primary/20">
                    <img
                      alt="Sarah Jenkins"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9LESqyMHcgOTvwOfQNxBr9zXOy-4T_v5LLMBTxnaxmjyPPQ_0fZGn0ChrNV25SDrs4VZN1gH4nGipcW01_WJ3PtzmbIFWWAGq1YNNUpzw8SZmncWWU2UCJxnQOKD19pMGuCRH-w2Nz0OFSwUwJ5Ffonxg0aM6YqDmUbCK0kxVivk142pRyAk_13ErtnlnulIP7whf4O4FQb56PjRH9Hq0Etl6qfar9quYok5CbrDERxnFyL7GKPCJlL4GpJdbvdLe4f7JTRLYmMLc"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Sarah Jenkins</div>
                    <div className="flex select-none">
                      {renderStars(5, "text-[12px]")}
                    </div>
                  </div>
                </div>
                
                <p className="text-on-surface-variant text-xs italic leading-relaxed">
                  "My Labrador has sensitive skin and this food was a game changer. Her coat is finally shiny again!"
                </p>
              </div>

              <div className="space-y-2 mt-2">
                {/* User Pet Photos */}
                <div className="grid grid-cols-2 gap-1.5 select-none">
                  <div className="h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                    <img
                      alt="User Pet 1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf4VlV3ckog_cxIFMuFhJvCsqDdTdbSVa1CNGlvvec_kj8F_gFEIQFOFEbgbN4qP3BWpht8vwnEj0e4PvIzhTz9FiDFbytz_rj8j59d7D2PuAcLK0PwoH24J3kZbw4wOzmHfiPScRQG-RVXQk3u-P4NGhO-bf_y3lZAPty9--4rrxiGSI5SwGUDeht9DGQz_BavnBn4pDIOAOSvwcuW0-6Ywh39kIJkWd_uUhmviq8lOf7oTjjLLOH9MpbnTuW-9rwgOv-mDn-xBeW"
                    />
                  </div>
                  <div className="h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                    <img
                      alt="User Pet 2"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuChmW-vsKR1T42Icof-4T-b6EavjTEB1cBMDAsRm25ywIlTOcGv5K8eX9RgD4d87HvQwoSlfJXE3EYzUL1MzutqfcFOFqEVgiVbOclTP--UPAteiwbQqYgJDk0rViHxpZnC0NcuasJ3Bog3TthCuM2kgwxUTvwAvgiy04XZhjyglwI3DTRY3N2KbG_9w__tAU_yzPKvlrVuYtY8MsFY7p1hZSubnvbOOhZn1G9xVtQQrGMTh5Lzn_x7G17m6xn40W3PeZ08L9YlMlyT"
                    />
                  </div>
                </div>

                <div className="text-on-surface-variant text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-green-600">verified_user</span>
                  Verified Purchase
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white dark:bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden border border-primary/20">
                    <img
                      alt="Mark Thompson"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjVb36aNRPTLouWqEcxRuMWbXr8fSAM3ftdOBK1lJMgQQv_fB1wCn1GqcDIspzsZqdpodZUVO-b10coWGJKWr_KRzrWyj7ZszPFFbAFenDx4X9KPdEWZz2PORVxR4dnLtMP6AtZ1yScTGW_jmQ6TzGagwuy7vhAm2pNHmbYq1uK0TgNcH-9u0YfplbS735dvfXWjy8jUrTMtwSK2gSbypX2ZLHQulzBe5u0uUR1oZSd_aoYlTatRc_82uDNn09xwXxtcFSUozHi7YE"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Mark Thompson</div>
                    <div className="flex select-none">
                      {renderStars(4, "text-[12px]")}
                    </div>
                  </div>
                </div>
                
                <p className="text-on-surface-variant text-xs italic leading-relaxed">
                  "Great quality, though I wish it came in even larger bags. My Husky loves the taste."
                </p>
              </div>

              <div className="space-y-2 mt-2">
                {/* User Pet Photo */}
                <div className="h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                  <img
                    alt="User Pet 3"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeTw9puA01ASb07PuVgjlM_4pPLh17oQr0GL-lh11UwLoJyMo9_AKYA4l147d6I0gEXl-Id_2WsFCYriCE6Pgrn9_3clCeV5bMufA9eZAswzyDk_kSzLOyJ9SyYrYZQ-M93wfXIAhp-J_miI_lXTAb4YyejiKvSgTPidL9vPHGg2mEIKE65WPpDBf2N9D0pIAZpqm0duqVfSqQ-_4_cQdjHNDuOqsabzNvO23PS0ghjvzZGL3NpkAVIVGEJ35YQWVdyXVfVuB-TqoR"
                  />
                </div>

                <div className="text-on-surface-variant text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-green-600">verified_user</span>
                  Verified Purchase
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-white dark:bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden border border-primary/20">
                    <img
                      alt="Emily Chen"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBprqtGteVhcXcwvbnBqctzetyGggeMP_XntnvBpeStvlJw__d-eT6qNI3ZP8OnXeY9ezjL0Vzdo05ClrxXW12k3rF-ZFAS6M3LgSVP03KYoK43LLq0fMHTp3Npjx1pQlVVgbXaINRTaQcDTDLvT1akONciNFlKjnM-ZRL0K_4SrjgXvAFMExhWe6G5KdCp-qcsYnLdXRYZ8rBfZryLfeM8PYA7BvWAMNqNnNU-GpV0RdiWXV3Vc6AmIFqT3OqH9GeMDtUXVeh5IgZn"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Emily Chen</div>
                    <div className="flex select-none">
                      {renderStars(5, "text-[12px]")}
                    </div>
                  </div>
                </div>
                
                <p className="text-on-surface-variant text-xs italic leading-relaxed">
                  "Excellent delivery speed and the packaging is so premium. Worth every penny for my rescue dog."
                </p>
              </div>

              <div className="space-y-2 mt-2">
                {/* User Pet Photo */}
                <div className="h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                  <img
                    alt="User Pet 4"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl6-fJIspdmYuszC-9PjolXiQBfc0lJUzbLT2_OEQTfrt3lgD-kLymNAr115u_o9oQYdOrEwskDFrWdaaVK6-d-89XDlvvPg-lpwd734EpzuD6OQAQIg_oxmuh6-18OKDVaHiUl9BtpfY5pdWcrcikA3QP9KWRqDA_vV7Ts6McCEm-oadbGoIpZo7SEWsOd_6GlhzbpN2aLcMSo5DkVeWacTuVilC4ubVSQXhN-kCe1Tc0CNbIKcsgQjClYPx84BUni_YcW4F8YbPx"
                  />
                </div>

                <div className="text-on-surface-variant text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-green-600">verified_user</span>
                  Verified Purchase
                </div>
              </div>
            </div>

          </div>

          {/* View All Reviews link */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/reviews"
              className="text-primary font-bold text-xs hover:underline flex items-center gap-0.5"
            >
              View All Reviews
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>
                chevron_right
              </span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
