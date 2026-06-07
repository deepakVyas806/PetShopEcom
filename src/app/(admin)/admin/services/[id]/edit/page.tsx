import { notFound } from "next/navigation";
import { SERVICES } from "@/app/containers/admin/ServicesContainer/data";
import CreateServiceContainer from "@/app/containers/admin/ServicesContainer/CreateServiceContainer/CreateServiceContainer";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) notFound();
  return <CreateServiceContainer service={service} />;
}
