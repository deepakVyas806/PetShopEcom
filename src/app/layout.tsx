import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { StoreProvider } from "@/context/StoreContext";
import AppChrome from "@/components/layout/AppChrome";


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

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking script to prevent dark mode light-theme flash on initial load */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const stored = localStorage.getItem("theme");
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (stored === "dark" || (!stored && systemPrefersDark)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {
                console.error(e);
              }
            })();
          `
        }} />
        {/* Load Google Material Symbols Outlined icons for the Stitch Header design */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>

      <body className="min-h-full flex flex-col font-sans selection:bg-brand-primary selection:text-white bg-brand-background text-brand-foreground pb-20 md:pb-0">
        <StoreProvider>
          <AppChrome>
            {children}
          </AppChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
