import type { ReactNode } from "react";
import { headers } from "next/headers";
import ModifiedHeader from "@/components/layout/ModifiedHeader";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export default async function AppChrome({ children }: { children: ReactNode }) {
  const hdrs = await headers();

  // proxy.ts sets x-is-admin:1 on every /admin/* request so we can skip
  // rendering customer chrome entirely — no z-index tricks needed.
  if (hdrs.get("x-is-admin") === "1") {
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
