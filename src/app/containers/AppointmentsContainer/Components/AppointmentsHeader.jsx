"use client";

import PageHeader from "@/components/common/PageHeader";

export default function AppointmentsHeader() {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",       href: "/"        },
        { label: "My Account", href: "/profile" },
        { label: "Appointments"                 },
      ]}
      title="My Appointments"
      subtitle="Spa days, training sessions & health check-ups for your pets."
      action={{ label: "Book New Service", icon: "add", href: "/services" }}
    />
  );
}
