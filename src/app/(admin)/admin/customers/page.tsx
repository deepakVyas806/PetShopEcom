import PageHeader          from "@/components/common/PageHeader";
import CustomersContainer  from "@/app/containers/admin/CustomersContainer/CustomersContainer";

export default function AdminCustomersPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Customers" }]}
        title="Customer Database"
        subtitle="Manage pet parents, track lifetime value, and review purchase history."
      />
      <CustomersContainer />
    </>
  );
}
