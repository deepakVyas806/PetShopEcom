"use client";

import useNotificationsContainer  from "./NotificationsContainer.hook";
import NotificationsHeader        from "./Components/NotificationsHeader";
import NotificationsFilter        from "./Components/NotificationsFilter";
import NotificationCard           from "./Components/NotificationCard";
import NotificationsEmpty         from "./Components/NotificationsEmpty";
import Pagination                 from "@/components/common/Pagination";

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
      <div className="w-10 h-10 rounded-xl animate-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded-full animate-shimmer" />
        <div className="h-2.5 w-full rounded-full animate-shimmer" />
        <div className="h-2.5 w-4/5 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

export default function NotificationsContainer({ showHeader = true }) {
  const {
    filtered,
    unreadCount,
    activeFilter,
    setActiveFilter,
    markRead,
    markAllRead,
    deleteNotification,
    loading,
    page,
    totalPages,
    goToPage,
  } = useNotificationsContainer();

  return (
    <div className="py-2 space-y-3">
      {showHeader && (
        <NotificationsHeader
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
        />
      )}

      {/* Filter pills */}
      <NotificationsFilter
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
      />

      {/* Notification list */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => <NotificationSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <NotificationsEmpty />
      ) : (
        <>
          <div className="space-y-2">
            {filtered.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
}
