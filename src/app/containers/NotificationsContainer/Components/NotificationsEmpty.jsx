"use client";

import Link from "next/link";

export default function NotificationsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
        <span className="material-symbols-outlined text-outline-variant text-3xl">notifications_off</span>
      </div>
      <div>
        <h2 className="text-xs font-bold text-on-surface mb-1">No notifications yet</h2>
        <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
          Order updates, offers, and account alerts will appear here.
        </p>
      </div>
      <Link
        href="/marketplace"
        className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-md transition-all"
      >
        Go Shopping
      </Link>
    </div>
  );
}
