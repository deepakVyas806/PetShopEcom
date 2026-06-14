import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  headers: async () => [
    {
      // Service worker must be served without cache
      source: "/sw.js",
      headers: [
        { key: "Cache-Control",   value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // Manifest
      source: "/manifest.json",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
        { key: "Content-Type", value: "application/manifest+json" },
      ],
    },
    {
      // Icons — long cache
      source: "/icons/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;
