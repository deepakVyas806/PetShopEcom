"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Spinner = () => (
  <div className="min-h-[calc(100vh-128px)] flex items-center justify-center">
    <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated, user } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !hydrated) return;
    if (!isAuthenticated) {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user?.role === "admin") {
      router.replace("/admin");
    }
  }, [mounted, hydrated, isAuthenticated, user, router, pathname]);

  // Server render and first client paint must match — proxy.ts already guards.
  if (!mounted) return <>{children}</>;

  // Hydrated but failing auth — show spinner while redirect fires
  if (!hydrated) return <Spinner />;
  if (!isAuthenticated || user?.role === "admin") return <Spinner />;

  return <>{children}</>;
}
