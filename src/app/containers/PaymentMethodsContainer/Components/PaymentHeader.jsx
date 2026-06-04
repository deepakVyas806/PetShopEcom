"use client";

import PageHeader from "@/components/common/PageHeader";

export default function PaymentHeader() {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",           href: "/"        },
        { label: "My Account",     href: "/profile" },
        { label: "Payment Methods"                  },
      ]}
      title="Payment Methods"
      subtitle="Manage secure payment options and set your preferred default for seamless checkout."
      action={{ label: "Add New Payment Method", icon: "add_card" }}
    />
  );
}
