import { Suspense } from "react";
import ServicesContainer from "@/app/containers/ServicesContainer/ServicesContainer";

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant text-sm font-medium">
          Loading Services...
        </div>
      }
    >
      <ServicesContainer />
    </Suspense>
  );
}
