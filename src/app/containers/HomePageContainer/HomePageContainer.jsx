"use client";

import useHomePage        from "./HomePageContainer.hook";
import TrustBar           from "./Components/TrustBar";
import HeroSection        from "./Components/HeroSection";
import ShopByPet          from "./Components/ShopByPet";
import LifeStageSection   from "./Components/LifeStageSection";
import BestSellers        from "./Components/BestSellers";
import ServicesSection    from "./Components/ServicesSection";
import BundlePromo        from "./Components/BundlePromo";
import Testimonials       from "./Components/Testimonials";

export default function HomePageContainer() {
  const {
    premiumShowcase,
    addedItems,
    handleAddToCart,
    favorites,
    toggleFavorite,
  } = useHomePage();

  return (
    <div className="min-h-screen bg-background text-on-background pb-16 md:pb-0">

      {/* 1. Trust strip */}
      <TrustBar />

      {/* 2. Hero */}
      <HeroSection />

      {/* 3. Shop by Pet */}
      <ShopByPet />

      {/* 4. Shop by Life Stage */}
      <LifeStageSection />

      {/* 5. Best Sellers */}
      <BestSellers
        premiumShowcase={premiumShowcase}
        addedItems={addedItems}
        handleAddToCart={handleAddToCart}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      {/* 6. Services */}
      <ServicesSection />

      {/* 7. Bundle promo */}
      <BundlePromo />

      {/* 8. Testimonials */}
      <Testimonials />

    </div>
  );
}
