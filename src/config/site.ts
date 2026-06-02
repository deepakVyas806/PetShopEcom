// Brand & Site Configuration - Centralized Single Source of Truth

// 1. Define active theme: "kinetic" | "mass-market" | "premium"
export type ThemeType = "kinetic" | "mass-market" | "premium";
export const activeTheme = "premium" as ThemeType;

// 2. Theme 1 Specification - Kinetic Pet Systems (Tech-Forward Minimalist Pet Care)
const kineticTheme = {
  name: "Kinetic Pet Systems",
  tagline: "High-Performance Medical-Grade Care & Tech",
  description: "Advanced biomechanical pet supports, veterinary-grade molecular nutrition, and digital precision trackers for active companions.",
  colors: {
    primary: "#090d16",        // Slate Black/Navy
    primaryHover: "#1e293b",
    secondary: "#d4af37",      // Muted Tech Gold
    secondaryHover: "#b8962f",
    accent: "#ba1a1a",         // Precision Red
    accentHover: "#93000a",
    bgLight: "#fafbfd",        // Ice cool background
    bgDark: "#09090b",
    cardLight: "#ffffff",
    cardDark: "#18181b",
    textLight: "#090d16",
    textDark: "#f4f4f5",
  },
  borderRadius: "0.75rem",    // 12px
  fontFamily: "var(--font-geist-sans)",
  logoIconType: "hexagon-paw",
};

// 3. Theme 2 Specification - Mass-Market E-Commerce (High-Density Shopping Boutique)
const massMarketTheme = {
  name: "Art Pet Shop",
  tagline: "Vibrant Choice, Unbeatable Prices, Same-Day Dispatch",
  description: "Your ultimate online mega-store for daily pet supplies, toys, snacks, premium bedding, and affordable veterinarian consultations.",
  colors: {
    primary: "#3b0764",        // Deep Velvet Purple
    primaryHover: "#581c87",   // Royal Violet Purple
    secondary: "#a855f7",      // Electric Purple
    secondaryHover: "#c084fc",
    accent: "#f08804",         // Coral Amber Accent
    accentHover: "#c45500",
    bgLight: "#fcfaff",        // Soft lavender neutral page background
    bgDark: "#0c0517",         // Velvet dark purple background
    cardLight: "#ffffff",
    cardDark: "#150b24",       // Velvet dark card background
    textLight: "#1c0732",      // Velvet dark text
    textDark: "#ebd5ff",       // Soft violet text
  },
  borderRadius: "1rem",    // 16px (smooth rounded corners)
  fontFamily: "var(--font-geist-sans)",
  logoIconType: "shopping-bag",
};

// 4. Theme 3 Specification - artPetShop Premium (Glassmorphism & Minimalism)
const premiumTheme = {
  name: "artPetShop Premium",
  tagline: "Premium Modern Pet Care & Exquisite Supplies",
  description: "Experience premium modern pet care with glassmorphic sophistication. High-end toys, organic nutrition, and top-tier veterinarian consultations.",
  colors: {
    primary: "#630ed4",        // Rich Purple
    primaryHover: "#732ee4",   // Soft Purple
    secondary: "#635b6e",      // Secondary Slate
    secondaryHover: "#4a4456",
    accent: "#7c3aed",         // Lavender Accent
    accentHover: "#5a00c6",
    bgLight: "#f9f9ff",
    bgDark: "#151c27",
    cardLight: "#ffffff",
    cardDark: "#2a313d",
    textLight: "#151c27",
    textDark: "#ebf1ff",
  },
  borderRadius: "1rem",
  fontFamily: "var(--font-inter)",
  logoIconType: "shopping-bag",
};

// Select the theme configuration based on user selection
const activeThemeConfig = 
  activeTheme === "kinetic" 
    ? kineticTheme 
    : activeTheme === "mass-market" 
    ? massMarketTheme 
    : premiumTheme;


export const siteConfig = {
  themeType: activeTheme as ThemeType,
  name: activeThemeConfig.name,
  tagline: activeThemeConfig.tagline,
  description: activeThemeConfig.description,
  borderRadius: activeThemeConfig.borderRadius,
  logoIconType: activeThemeConfig.logoIconType,
  colors: activeThemeConfig.colors,

  // Combined Navigation Header Links - Shortened for App Header
  navigation: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/marketplace" },
    { label: "Pharmacy", href: "/pharmacy" },
    { label: "Book Care", href: "/services/book" },
    { label: "Scheduler", href: "/services/scheduler" },
    { label: "Orders", href: "/checkout" },
    { label: "Admin Panel", href: "/admin", adminOnly: true },
  ],

  // Contact details
  contact: {
    phone: "+91 1800-999-PETS",
    email: activeTheme === "kinetic" ? "clinical@kineticpet.co.in" : "support@artpetshop.in",
    address: activeTheme === "kinetic" ? "Science & Research Park, HSR Layout, Bangalore, Karnataka, India" : "120 Logistics Hub, Andheri East, Mumbai, Maharashtra, India",
  },

  // Interactive mock products matching theme styles with high-quality Unsplash URLs
  products: [
    {
      id: "p1",
      name: activeTheme === "kinetic" 
        ? "Bio-Pulse Smart Canine Harness" 
        : activeTheme === "mass-market" 
        ? "Vibrant Durable Chew Toy (Pack of 3)" 
        : "Organic Peak Nutrition",
      price: activeTheme === "kinetic" 
        ? 14999.00 
        : activeTheme === "mass-market" 
        ? 499.00 
        : 4199.00,
      mrp: activeTheme === "kinetic" 
        ? 18000.00 
        : activeTheme === "mass-market" 
        ? 799.00 
        : 5039.00,
      rating: 4.8,
      reviewsCount: 142,
      category: "dogs",
      badge: "POPULAR",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD70Kuyk3R9WwQXyzo70SUTPGtcqUQxpXBcXJ374A6ronVEN-vdBKwBP0A-9xNW_sdGWQGzIgIywkrhwo3H-yPRX_ZCDgmlFmQtSP19NRggmZccEiOg62KFnnOJLPsPS75ytdvf_u5Zx0k9DNKa2F7yh1KSBN8rTdUWec2AMIH1LO3xj8wOyrmUPmO9F3tdE6i57zbWNiRrhOYqH1ObQsyl-acULNVEbk9vpKTLDbDKqaHzOegQLqrjTb8h6LIkRqwqNqEQd-Lk-qHM",
      description: "Grain-free holistic formula for optimal health and vitality.",
      bullets: [
        "Formulated with zero corn, soy, wheat, or synthetic fillers for sensitive digestion",
        "Enriched with active prebiotic fibers and clinical organic proteins",
        "Promotes strong immunity and lean muscle maintenance",
        "Veterinarian certified for puppies and adult dogs alike"
      ]
    },
    {
      id: "p2",
      name: activeTheme === "kinetic" 
        ? "Cellular-Repair Organic Feline Kibble" 
        : activeTheme === "mass-market" 
        ? "Gourmet Tuna & Mackerel Wet Food" 
        : "Traveler Luxe Carrier",
      price: activeTheme === "kinetic" 
        ? 4999.00 
        : activeTheme === "mass-market" 
        ? 299.00 
        : 10836.00,
      mrp: activeTheme === "kinetic" 
        ? 5500.00 
        : activeTheme === "mass-market" 
        ? 399.00 
        : 12900.00,
      rating: 4.9,
      reviewsCount: 96,
      category: "cats",
      badge: "BESTSELLER",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjzAKqRLPz3ra9DhOyNaODCoVF4uC3Jjctr4Y3Por5WqmNjgWX5gWeX81CTamiP_6xC4Izl2qOq507F_TwWSW0PLzS_QM4LQ903WXszoOJ7ETxM5Q9b8-TDdHl94ArAkGMLWxhbGva_ozf7JiwSmpKovzGLGW5mUBs9vj0rSgv7M8X02ULVYnUvn159ndbem-J_acfFvEaw44Mt-V_4YLB3nvBk6nvYgWng6rJ6wmLFt5ZaaK-tb4kOtiPNSJ_codMK4DXREGJlKKr",
      description: "Vegan leather, breathable mesh and designer hardware.",
      bullets: [
        "Crafted with durable water-resistant premium vegan leather",
        "Full-ventilation breathable mesh slots on all three sides",
        "Integrated security leash hook inside and plush removable floor cushion",
        "Perfect airline-approved size for small dogs and cats"
      ]
    },
    {
      id: "p3",
      name: activeTheme === "kinetic" 
        ? "Hydro-Cell Orthopedic Reptile Incubator" 
        : activeTheme === "mass-market" 
        ? "Warm Cozy Reptile Climbing Hammock" 
        : "Guardian Smart Collar",
      price: activeTheme === "kinetic" 
        ? 29999.00 
        : activeTheme === "mass-market" 
        ? 599.00 
        : 7476.00,
      mrp: activeTheme === "kinetic" 
        ? 35000.00 
        : activeTheme === "mass-market" 
        ? 799.00 
        : 8900.00,
      rating: 4.7,
      reviewsCount: 220,
      category: "dogs",
      badge: "SMART",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf6oPbKOadpfy_JcybTehdbDijIECYyi_Ircy3hA2rp45yni0pXkJXp8nDtlOd9bZ_BSrz_VtY1bmxVMG-2ebIFhIxVsprRo5fD0rLqlwVAwfuby7JM279HeF6fJmtwEqmuYcfGTlm8iXxle7r17QCUFQAk1ljM22UScXHaLhxBgBKw7RJ_gGb74A_zz7bz0IpiPVlEulyeFRBDYqc0OTjKt5dw4dYavMJtetig1w-fZmQy7vFK3dINPN20VFY3-EatC6X3G0jwvk-",
      description: "Real-time GPS Tracking and continuous health telemetry.",
      bullets: [
        "Sleek minimalist water-resistant collar structure",
        "Continuous heart rate, temperature, and joint stress indicators",
        "Integrated boundary fence with immediate smartphone alerts",
        "Long-lasting battery life of up to 14 days per charge cycle"
      ]
    },
    {
      id: "p4",
      name: activeTheme === "kinetic" 
        ? "Joint-Recovery Compression Leg Brace" 
        : activeTheme === "mass-market" 
        ? "Adjustable Padded Dog Raincoat" 
        : "Artisan Ceramic Bowl",
      price: activeTheme === "kinetic" 
        ? 7999.00 
        : activeTheme === "mass-market" 
        ? 899.00 
        : 2898.00,
      mrp: activeTheme === "kinetic" 
        ? 9500.00 
        : activeTheme === "mass-market" 
        ? 1199.00 
        : 3450.00,
      rating: 4.8,
      reviewsCount: 73,
      category: "cats",
      badge: "ARTISANAL",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiWV3Gaum1af5SRf2ID9IhHSNzZUImNNnkspXr9nxcm8PANw5wilPJ5o0idb4sqMKKLhCv16llDd3xJcH22LZXbn6HTW9W2vNDx2VZJebOM6G2CJN4eXdKW5w4NnXXtiQvoerGY8FzsHC9iF8exMy7hsnxWdEQ2FjEHJt-7VwIBLn2EFX6ABlkuXL19JqUamLXcFNyeVFEyzhsGlxUhFn3hK5uldKlWiwk2_aaiCfpTX9fOKXsr6LLiULfaWRidIYDdGhE1hTzdAz3",
      description: "Hand-glazed heavy stoneware bowl set.",
      bullets: [
        "Individually hand-glazed high-temperature durable ceramics",
        "Non-slip bottom ring preventing scratching and spills",
        "Ergonomically elevated to reduce neck strain in puppies and kittens",
        "100% lead-free, cadmium-free, food-safe, and dishwasher safe"
      ]
    },
    {
      id: "p5",
      name: activeTheme === "kinetic" ? "Laser-Assisted Bio-Active Toy Sphere" : "Feather Wand Cat Teaser Toy",
      price: activeTheme === "kinetic" ? 6499.00 : 199.00,
      mrp: activeTheme === "kinetic" ? 7500.00 : 299.00,
      rating: 4.6,
      reviewsCount: 220,
      category: "cats",
      badge: "Hot Deal",
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600",
      description: "Revolving laser simulator that triggers healthy physical exercise inside flat apartments.",
      bullets: [
        "36-inch flexible carbon-fiber wand mimics real bird movements to trigger prey instincts",
        "Includes 3 interchangeable natural-feather refills and tinkling bells",
        "Non-slip ergonomic foam handle offers comfortable hold during high-energy play",
        "Helps indoor cats burn excess energy and maintain healthy muscle tones",
        "Safe, non-toxic colors and structural components tested for long-lasting cat play"
      ]
    },
    {
      id: "p6",
      name: activeTheme === "kinetic" ? "Ultrasonic Aquatic Habitat Purifier" : "Floating Turtle Dock Sun Platform",
      price: activeTheme === "kinetic" ? 12999.00 : 699.00,
      mrp: activeTheme === "kinetic" ? 15000.00 : 999.00,
      rating: 4.9,
      reviewsCount: 73,
      category: "exotics",
      badge: "New Arrival",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600",
      description: "Vibrating micro-membrane cleaning algae and micro-bacteria without chemicals, completely biological.",
      bullets: [
        "Self-leveling platform floating system rises and falls automatically with water levels",
        "E-Z slide ramp allows smaller reptiles and turtles to climb out of water easily",
        "Allows full exposure to UVB rays and heat lamps for healthy digestion and shell strength",
        "Secures to aquarium walls with dual heavy-duty suction cup lock brackets",
        "Molded from durable, non-toxic, chemical-free resin that will not pollute water quality"
      ]
    },
    {
      id: "p7",
      name: activeTheme === "kinetic" ? "Clinical Bio-Immune Liquid Solution" : "Multi-Vitamin & Coat Growth Supplement",
      price: activeTheme === "kinetic" ? 2999.00 : 399.00,
      mrp: activeTheme === "kinetic" ? 3500.00 : 499.00,
      rating: 4.8,
      reviewsCount: 142,
      category: "pharmacy",
      badge: "Rx Medicine",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600",
      description: "Essential clinical multivitamins and prebiotic cultures supporting active bone density and hair coat control.",
      bullets: [
        "Enriched with high concentration Omega-3, Calcium, and Vitamin D3",
        "Promotes healthy hair growth, shiny coat, and reduces shedding by 90%",
        "Formulated by clinical pet doctors, fully vet approved and compliant",
        "Pork-flavored liquid drops: easily mixes with dry kibble or water"
      ]
    },
    {
      id: "p8",
      name: activeTheme === "kinetic" ? "Molecular Parasitic Spot-On Shield" : "Flea & Tick Prevention Spot-on drops",
      price: activeTheme === "kinetic" ? 3999.00 : 599.00,
      mrp: activeTheme === "kinetic" ? 4500.00 : 799.00,
      rating: 4.7,
      reviewsCount: 98,
      category: "pharmacy",
      badge: "Top Rated",
      image: "https://images.unsplash.com/photo-1608454367599-c1139e64e8b2?auto=format&fit=crop&q=80&w=600",
      description: "Fast acting spot-on ticks and fleas prevention drops protecting your dog for up to 30 days continuous.",
      bullets: [
        "Kills ticks, adult fleas, lice, and larval stages within 24 hours of contact",
        "Waterproof formula: remains fully active after bathing or swimming",
        "Veterinary standard dosage: easy spot applicator at the back of neck",
        "Safe for all dogs and puppies over 8 weeks old"
      ]
    },
    {
      id: "p9",
      name: activeTheme === "kinetic" ? "Intestinal Broad-Spectrum Tablets" : "Broad-Spectrum Deworming Tablets (4 Pack)",
      price: activeTheme === "kinetic" ? 1999.00 : 249.00,
      mrp: activeTheme === "kinetic" ? 2500.00 : 349.00,
      rating: 4.9,
      reviewsCount: 110,
      category: "pharmacy",
      badge: "Essential",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
      description: "Broad spectrum dewormer targeting roundworms, hookworms, and tapeworms in puppies and kittens.",
      bullets: [
        "Easy dose chewable tablets: highly palatable pork and beef flavoring",
        "Treats all common intestinal parasites in a single veterinary dose",
        "Recommended dosage routine: once every 3 months for full prevention",
        "FDA-compliant formulation tested safe across all dog and cat breeds"
      ]
    }
  ],

  // Interactive mock services for scheduler/booking
  services: [
    {
      id: "s1",
      name: activeTheme === "kinetic" ? "Therapeutic Biomechanical Gait Analysis" : "Pet Bath, Spa & Luxury Hair Trim",
      price: activeTheme === "kinetic" ? 9999.00 : 999.00,
      duration: "45 mins",
      specialist: "Dr. Alexander Vance (DVM)",
      rating: 4.9,
      description: "Full clinical gait evaluation mapping skeletal angles and custom orthosis fitting."
    },
    {
      id: "s2",
      name: activeTheme === "kinetic" ? "Molecular Metabolic Diet Consultation" : "Basic Grooming & Nail Clipping",
      price: activeTheme === "kinetic" ? 7999.00 : 499.00,
      duration: "30 mins",
      specialist: "Dr. Elena Rostova (PHD)",
      rating: 4.8,
      description: "Individual micro-nutrient and digestion optimization based on age/breed metrics."
    },
    {
      id: "s3",
      name: activeTheme === "kinetic" ? "Advanced Cardiovascular Stress Screening" : "Vaccination Clinic & Health Checkup",
      price: activeTheme === "kinetic" ? 14999.00 : 1499.00,
      duration: "60 mins",
      specialist: "Dr. Keith Bryant (DVM)",
      rating: 5.0,
      description: "Full ECG and vascular ultrasonic screening for active sports dogs."
    }
  ]
};
