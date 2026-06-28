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
};
