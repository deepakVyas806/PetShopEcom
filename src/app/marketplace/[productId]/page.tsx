import React, { Suspense } from "react";
import ProductDetailsContainer from "@/app/containers/ProductDetailsContainer/ProductDetailsContainer";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { productId } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant font-medium">
        Loading Product Details...
      </div>
    }>
      <ProductDetailsContainer productId={productId} />
    </Suspense>
  );
}
