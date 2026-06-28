"use client";

import PageHeader from "@/components/common/PageHeader";

export default function AddressesHeader({ onAdd }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",          href: "/"        },
        { label: "My Account",    href: "/profile" },
        { label: "Saved Addresses"                 },
      ]}
      title="Saved Addresses"
      subtitle="Manage your shipping and billing locations for faster checkout."
      action={{ label: "Add New Address", icon: "add_location_alt", onClick: onAdd }}
    />
  );
}
