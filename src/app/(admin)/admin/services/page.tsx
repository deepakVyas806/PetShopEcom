import PageHeader        from "@/components/common/PageHeader";
import ServicesContainer from "@/app/containers/admin/ServicesContainer/ServicesContainer";

export default function AdminServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Services" }]}
        title="Service Management"
        subtitle="Manage grooming, training, and daycare offerings."
      />
      <ServicesContainer />
    </>
  );
}
