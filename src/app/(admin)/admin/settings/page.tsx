import PageHeader from "@/components/common/PageHeader";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
        title="Settings"
        subtitle="Configure store settings and preferences."
      />
      <div className="text-xs text-on-surface-variant text-center py-20">
        Settings UI coming soon…
      </div>
    </>
  );
}
