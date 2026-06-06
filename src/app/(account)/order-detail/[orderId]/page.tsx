import { Suspense } from "react";
import OrderDetailContainer from "@/app/containers/OrderDetailContainer/OrderDetailContainer";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { orderId } = await params;
  return { title: `Order #${orderId} | artPetShop` };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  return (
    <Suspense fallback={
      <div className="py-12 text-center text-xs text-on-surface-variant">Loading order…</div>
    }>
      <OrderDetailContainer orderId={orderId} />
    </Suspense>
  );
}
