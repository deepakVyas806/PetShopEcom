import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { CUSTOMERS } from "@/app/containers/admin/CustomersContainer/data";
import CustomerProfileContainer from "@/app/containers/admin/CustomersContainer/CustomerProfileContainer/CustomerProfileContainer";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = CUSTOMERS.find((c) => c.id === id);
  if (!customer) notFound();

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
        title={customer.name}
        subtitle={`${customer.email} · Joined ${customer.joinedAgo}`}
      />
      <CustomerProfileContainer customer={customer} />
    </>
  );
}
