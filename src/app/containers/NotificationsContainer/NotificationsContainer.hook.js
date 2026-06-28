import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/lib/api";

const PAGE_SIZE = 20;

function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function normalise(n) {
  return {
    ...n,
    id:      n._id,
    actions: n.actions ?? [],
    time:    relativeTime(n.createdAt),
  };
}

export default function useNotificationsContainer() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter,  setActiveFilter]  = useState("all");
  const [loading,       setLoading]       = useState(true);
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);

  const fetchPage = useCallback((p = 1) => {
    setLoading(true);
    api.get(`/notifications?page=${p}&limit=${PAGE_SIZE}`)
      .then(data => {
        setNotifications(data.notifications?.map(normalise) ?? []);
        setTotalPages(data.totalPages ?? 1);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "orders")     return notifications.filter(n => n.type === "order");
    if (activeFilter === "promotions") return notifications.filter(n => n.type === "promo");
    if (activeFilter === "account")    return notifications.filter(n => n.type === "account");
    return notifications;
  }, [notifications, activeFilter]);

  const markRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    window.dispatchEvent(new CustomEvent("notif:changed"));
    try { await api.put(`/notifications/${id}/read`); } catch { /* optimistic */ }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    window.dispatchEvent(new CustomEvent("notif:changed"));
    try { await api.put("/notifications/read-all"); } catch { /* optimistic */ }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    window.dispatchEvent(new CustomEvent("notif:changed"));
    try { await api.delete(`/notifications/${id}`); } catch { /* optimistic */ }
  }, []);

  return {
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
    goToPage: fetchPage,
  };
}
