import React, { Suspense } from "react";
import OrderConfirmationContainer from "@/app/containers/OrderConfirmationContainer/OrderConfirmationContainer";

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant text-sm font-medium">
          Loading Order Confirmation...
        </div>
      }
    >
      <OrderConfirmationContainer />
    </Suspense>
  );
}
