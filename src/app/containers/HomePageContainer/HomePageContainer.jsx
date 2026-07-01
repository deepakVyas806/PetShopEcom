"use client";

import useHomePage          from "./HomePageContainer.hook";
import HeroSection          from "./Components/HeroSection";
import FlashSaleSection     from "./Components/FlashSaleSection";
import ShopByPet            from "./Components/ShopByPet";
import ShopByCategoryGrid   from "./Components/ShopByCategoryGrid";
import FeaturedBrands       from "./Components/FeaturedBrands";
import BestSellers          from "./Components/BestSellers";
import OfferZoneBanners     from "./Components/OfferZoneBanners";
import NewArrivalsSection   from "./Components/NewArrivalsSection";
import LifeStageSection     from "./Components/LifeStageSection";
import SeasonalBanner       from "./Components/SeasonalBanner";
import ServicesSection      from "./Components/ServicesSection";
import BlogTipsSection      from "./Components/BlogTipsSection";
import BundlePromo          from "./Components/BundlePromo";
import TrustBar             from "./Components/TrustBar";
import Testimonials         from "./Components/Testimonials";
import NewsletterSection    from "./Components/NewsletterSection";

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

      {/* 1. Hero carousel */}
      <HeroSection />

      {/* 2. Flash Sale / Deal of the Day */}
      {/* <FlashSaleSection addedItems={addedItems} handleAddToCart={handleAddToCart} /> */}

      {/* 3. Shop by Pet (circles) */}
      <ShopByPet />

      {/* 4. Shop by Category grid */}
      <ShopByCategoryGrid />

      {/* 5. Featured Brands */}
      <FeaturedBrands />

      {/* 6. Best Sellers (tabbed) */}
      <BestSellers
        premiumShowcase={premiumShowcase}
        addedItems={addedItems}
        handleAddToCart={handleAddToCart}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      {/* 7. Offer Zone banners */}
      <OfferZoneBanners />

      {/* 8. New Arrivals horizontal scroll */}
      <NewArrivalsSection addedItems={addedItems} handleAddToCart={handleAddToCart} />

      {/* 9. Shop by Life Stage */}
      <LifeStageSection />

      {/* 10. Seasonal campaign banner */}
      {/* <SeasonalBanner /> */}

      {/* 11. Services */}
      <ServicesSection />

      {/* 12. Pet Care Blog */}
      {/* <BlogTipsSection /> */}

      {/* 13. Bundle promo */}
      {/* <BundlePromo /> */}

      {/* 14. Trust indicators */}
      <TrustBar />

      {/* 15. Testimonials */}
      <Testimonials />

      {/* 16. Newsletter + community */}
      {/* <NewsletterSection /> */}

    </div>
  );
}
