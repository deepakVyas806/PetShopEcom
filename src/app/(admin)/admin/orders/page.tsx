import PageHeader       from "@/components/common/PageHeader";
import OrdersContainer from "@/app/containers/admin/OrdersContainer/OrdersContainer";

export default function AdminOrdersPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]}
        title="Order Management"
        subtitle="Oversee customer transactions and logistical workflows."
      />
      <OrdersContainer />
    </>
  );
}
