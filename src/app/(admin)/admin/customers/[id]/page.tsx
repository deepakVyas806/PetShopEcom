import CustomerProfileContainer from "@/app/containers/admin/CustomersContainer/CustomerProfileContainer/CustomerProfileContainer";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerProfileContainer id={id} />;
}
