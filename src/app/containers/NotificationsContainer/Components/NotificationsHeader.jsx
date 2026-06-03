"use client";

export default function NotificationsHeader({ unreadCount, onMarkAllRead }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="text-sm font-bold text-on-surface">Notifications</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          <span className="text-primary font-bold">{unreadCount} unread</span>{" "}
          alert{unreadCount !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 text-primary text-xs font-medium hover:bg-primary/5 transition-colors rounded-lg cursor-pointer bg-transparent border-none"
        >
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 15 }}>done_all</span>
          Mark all read
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant text-xs font-medium hover:text-primary transition-colors cursor-pointer bg-transparent border-none">
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 15 }}>settings</span>
          Settings
        </button>
      </div>
    </div>
  );
}
