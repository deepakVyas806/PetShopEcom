"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",   // always check for a new SW on load
        });

        // Check for updates every time the page gains focus
        const checkUpdate = () => reg.update().catch(() => {});
        window.addEventListener("focus", checkUpdate);

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // A new version is ready — could show a toast here
              console.info("[PWA] Update available. Refresh to use the latest version.");
            }
          });
        });
      } catch (err) {
        console.warn("[PWA] Service worker registration failed:", err);
      }
    };

    // Register after load so it doesn't compete with critical resources
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
