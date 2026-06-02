import React, { Suspense } from "react";
import CheckoutContainer from "@/app/containers/CheckoutContainer/CheckoutContainer";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant text-sm font-medium">
          Loading Secure Checkout...
        </div>
      }
    >
      <CheckoutContainer />
    </Suspense>
  );
}
