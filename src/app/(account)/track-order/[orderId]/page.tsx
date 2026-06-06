import { Suspense } from "react";
import TrackOrderContainer from "@/app/containers/TrackOrderContainer/TrackOrderContainer";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { orderId } = await params;
  return { title: `Track Order #${orderId} | artPetShop` };
}

export default async function TrackOrderPage({ params }: PageProps) {
  const { orderId } = await params;
  return (
    <Suspense fallback={
      <div className="py-12 text-center text-xs text-on-surface-variant">Loading tracking info…</div>
    }>
      <TrackOrderContainer orderId={orderId} />
    </Suspense>
  );
}
