import PageHeader from "@/components/common/PageHeader";
import AdminDashboardContainer from "@/app/containers/admin/DashboardContainer/DashboardContainer";

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        title="Dashboard"
        subtitle="Real-time performance overview for artPetShop."
      />
      <AdminDashboardContainer />
    </>
  );
}
