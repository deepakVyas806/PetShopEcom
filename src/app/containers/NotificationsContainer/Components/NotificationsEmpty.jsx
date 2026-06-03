"use client";

import Link from "next/link";

export default function NotificationsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
        <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 40 }}>
          notifications_off
        </span>
      </div>
      <div>
        <h2 className="text-sm font-bold text-on-surface mb-1">No notifications yet</h2>
        <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
          When you get notifications about your orders, account, or special offers, they'll appear here.
        </p>
      </div>
      <Link
        href="/marketplace"
        className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-lg transition-all"
      >
        Go Shopping
      </Link>
    </div>
  );
}
