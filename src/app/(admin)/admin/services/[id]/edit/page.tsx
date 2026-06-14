import CreateServiceContainer from "@/app/containers/admin/ServicesContainer/CreateServiceContainer/CreateServiceContainer";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CreateServiceContainer editId={id} />;
}
