"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, hydrated } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthenticated, router, pathname]);

  // While hydrating session show a subtle spinner
  if (!hydrated) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated: render page
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Redirecting — keep spinner visible until navigation completes
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
