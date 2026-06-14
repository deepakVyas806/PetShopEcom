"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ModifiedHeader from "@/components/layout/ModifiedHeader";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <ModifiedHeader />
      <main className="flex-grow pt-0">{children}</main>
      <Footer />
      <MobileFooter />
    </>
  );
}
