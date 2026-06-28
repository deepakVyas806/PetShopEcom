"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function useNotificationCount() {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetch = useCallback(() => {
    if (!isAuthenticated) { setUnreadCount(0); return; }
    api.get("/notifications/unread-count")
      .then((data: any) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    fetch();

    // Refetch when another part of the app marks notifications read
    window.addEventListener("notif:changed", fetch);
    // Refetch when user switches back to this tab
    document.addEventListener("visibilitychange", fetch);
    // Poll every 60s as a fallback
    const timer = setInterval(fetch, 60_000);

    return () => {
      window.removeEventListener("notif:changed", fetch);
      document.removeEventListener("visibilitychange", fetch);
      clearInterval(timer);
    };
  }, [fetch]);

  return unreadCount;
}
