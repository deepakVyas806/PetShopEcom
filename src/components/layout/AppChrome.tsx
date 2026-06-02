"use client";

import React from "react";
import ModifiedHeader from "@/components/layout/ModifiedHeader";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModifiedHeader />
      <main className="flex-grow pt-0">{children}</main>
      <Footer />
      <MobileFooter />
    </>
  );
}
