"use client";

import PageHeader from "@/components/common/PageHeader";

export default function NotificationsHeader({ unreadCount, onMarkAllRead }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Home",       href: "/"        },
        { label: "My Account", href: "/profile" },
        { label: "Notifications"                },
      ]}
      title="Notifications"
      subtitle={`${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""} to review.`}
    >
      <button
        onClick={onMarkAllRead}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-primary text-xs font-medium hover:bg-primary/5 transition-colors rounded-full cursor-pointer bg-transparent border-none"
      >
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>done_all</span>
        Mark all read
      </button>
    </PageHeader>
  );
}
