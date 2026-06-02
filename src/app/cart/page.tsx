import React, { Suspense } from "react";
import ShoppingCartContainer from "@/app/containers/ShoppingCartContainer/ShoppingCartContainer"

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant font-medium">
        Loading Your Cart...
      </div>
    }>
      <ShoppingCartContainer />
    </Suspense>
  );
}
