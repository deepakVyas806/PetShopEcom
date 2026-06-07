import type { Metadata, Viewport } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import AppChrome from "@/components/layout/AppChrome";
import PWARegister from "@/components/PWARegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ── Viewport (theme-color lives here in Next 14+) ─────────────────────────── */
export const viewport: Viewport = {
  themeColor: "#630ed4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/* ── App metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,

  // PWA manifest
  manifest: "/manifest.json",

  // iOS PWA
  appleWebApp: {
    capable: true,
    title: "artPetShop",
    statusBarStyle: "black-translucent",
  },

  // Prevent iOS from auto-linking phone numbers / dates
  formatDetection: { telephone: false },

  // Open Graph (improves share appearance when added to iOS home screen)
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },

  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Dark-mode flash prevention */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem("theme"),d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(s==="dark"||(!s&&d)){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})();`
        }} />

        {/* ── iOS PWA: splash screens & standalone chrome ─────────────────── */}

        {/* Status bar overlay — purple tint on iOS notch */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="artPetShop" />

        {/* Apple touch icons (iOS uses these, not the manifest) */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192.png" />

        {/* iOS splash screens (portrait only — add landscape if needed) */}
        {/* iPhone 15 Pro Max */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/icons/splash-1290x2796.png" />
        {/* iPhone 14 / 15 */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/icons/splash-1170x2532.png" />
        {/* iPhone SE */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/icons/splash-750x1334.png" />
        {/* iPad Pro 12.9" */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" href="/icons/splash-2048x2732.png" />

        {/* ── Android / generic PWA ───────────────────────────────────────── */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="artPetShop" />
        <meta name="msapplication-TileColor" content="#630ed4" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
      </head>

      <body className="min-h-full flex flex-col font-sans selection:bg-brand-primary selection:text-white bg-brand-background text-brand-foreground pb-20 md:pb-0">
        <StoreProvider>
          <AuthProvider>
            <AppChrome>
              {children}
            </AppChrome>
          </AuthProvider>
        </StoreProvider>

        {/* Register service worker after hydration */}
        <PWARegister />
      </body>
    </html>
  );
}
