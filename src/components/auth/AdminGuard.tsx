"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) { router.replace("/signin?redirect=/admin"); return; }
    if (user?.role !== "admin") { router.replace("/"); }
  }, [hydrated, isAuthenticated, user, router]);

  // Server render and first client render must match — proxy.ts already guards the route.
  if (!mounted) return <>{children}</>;

  if (!hydrated || !isAuthenticated || user?.role !== "admin") return <Spinner />;

  return <>{children}</>;
}
