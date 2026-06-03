"use client";

import useNotificationsContainer  from "./NotificationsContainer.hook";
import NotificationsHeader        from "./Components/NotificationsHeader";
import NotificationsFilter        from "./Components/NotificationsFilter";
import NotificationCard           from "./Components/NotificationCard";
import NotificationsEmpty         from "./Components/NotificationsEmpty";
import NotificationsPagination    from "./Components/NotificationsPagination";

export default function NotificationsContainer() {
  const {
    filtered,
    unreadCount,
    activeFilter,
    setActiveFilter,
    markRead,
    markAllRead,
  } = useNotificationsContainer();

  return (
    <div className="py-2">
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
      />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Category filter sidebar */}
        <NotificationsFilter
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
        />

        {/* Notifications list */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <NotificationsEmpty />
          ) : (
            <>
              <div className="space-y-3">
                {filtered.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onMarkRead={markRead}
                  />
                ))}
              </div>
              <NotificationsPagination total={3} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
