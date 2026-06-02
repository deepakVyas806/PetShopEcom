import React, { Suspense } from "react";
import ProductsListContainer from "@/app/containers/ProductsListContainer/ProductsListContainer";

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant font-medium">
        Loading Products...
      </div>
    }>
      <ProductsListContainer />
    </Suspense>
  );
}
