"use client";

import useNotificationsContainer  from "./NotificationsContainer.hook";
import NotificationsHeader        from "./Components/NotificationsHeader";
import NotificationsFilter        from "./Components/NotificationsFilter";
import NotificationCard           from "./Components/NotificationCard";
import NotificationsEmpty         from "./Components/NotificationsEmpty";
import Pagination                 from "@/components/common/Pagination";

export default function NotificationsContainer({ showHeader = true }) {
  const {
    filtered,
    unreadCount,
    activeFilter,
    setActiveFilter,
    markRead,
    markAllRead,
  } = useNotificationsContainer();

  return (
    <div className="py-2 space-y-3">
      {showHeader && (
        <NotificationsHeader
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
        />
      )}

      {/* 1. Join ArtRewards — full width on all screens */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-primary mb-0.5">Join ArtRewards</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Earn paw-points for every notification you engage with and redeem for discounts.
          </p>
        </div>
        <button className="sm:shrink-0 px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-semibold hover:shadow-md transition-all cursor-pointer border-none whitespace-nowrap">
          Learn More
        </button>
      </div>

      {/* 2. Filter pills — full width */}
      <NotificationsFilter
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
      />

      {/* 3. Notifications list — full width */}
      {filtered.length === 0 ? (
        <NotificationsEmpty />
      ) : (
        <>
          <div className="space-y-2">
            {filtered.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={markRead}
              />
            ))}
          </div>
          <Pagination currentPage={1} totalPages={3} />
        </>
      )}
    </div>
  );
}
