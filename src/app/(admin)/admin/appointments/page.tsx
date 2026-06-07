import PageHeader from "@/components/common/PageHeader";
import AppointmentsContainer from "@/app/containers/admin/AppointmentsContainer/AppointmentsContainer";

export default function AdminAppointmentsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Appointments" }]}
        title="Appointments"
        subtitle="Track and manage all service bookings by date."
      />
      <AppointmentsContainer />
    </>
  );
}
