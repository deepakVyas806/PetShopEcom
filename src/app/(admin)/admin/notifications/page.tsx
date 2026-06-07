import PageHeader from "@/components/common/PageHeader";
import NotificationsContainer from "@/app/containers/NotificationsContainer/NotificationsContainer";

export default function AdminNotificationsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Notifications" }]}
        title="Notifications"
        subtitle="Manage and send notifications to customers."
      />
      <NotificationsContainer showHeader={false} />
    </>
  );
}
