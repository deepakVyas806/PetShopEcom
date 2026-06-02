"use client";

import React from "react";
import useHomePage from "./HomePageContainer.hook";
import HeroSection from "./Components/HeroSection";
import ShopByPet from "./Components/ShopByPet";
import BestSellers from "./Components/BestSellers";
import ServicesSection from "./Components/ServicesSection";
import TrustIndicators from "./Components/TrustIndicators";

export default function HomePageContainer() {
  const { premiumShowcase, addedItems, handleAddToCart } = useHomePage();

  return (
    <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300 pb-16 md:pb-0">
      {/* Hero Section Carousel */}
      <HeroSection />

      {/* Shop By Pet Grid */}
      <ShopByPet />

      {/* Best Sellers Slider */}
      <BestSellers 
        premiumShowcase={premiumShowcase}
        addedItems={addedItems}
        handleAddToCart={handleAddToCart}
      />

      {/* Services Grid (Grooming & Veterinary) */}
      <ServicesSection />

      {/* Trust & Reassurance Indicators */}
      <TrustIndicators />
    </div>
  );
}
