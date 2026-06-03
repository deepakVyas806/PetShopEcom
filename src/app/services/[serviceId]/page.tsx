import { Suspense } from "react";
import ServiceDetailsContainer from "@/app/containers/ServiceDetailsContainer/ServiceDetailsContainer";

interface PageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { serviceId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant text-sm font-medium">
          Loading Service Details...
        </div>
      }
    >
      <ServiceDetailsContainer serviceId={serviceId} />
    </Suspense>
  );
}
