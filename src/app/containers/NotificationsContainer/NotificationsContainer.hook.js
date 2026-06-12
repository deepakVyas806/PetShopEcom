import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";

const FILTER_MAP = {
  all:        () => true,
  orders:     (n) => n.type === "order",
  promotions: (n) => n.type === "promo",
  account:    (n) => n.type === "account",
};

export default function useNotificationsContainer() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter,  setActiveFilter]  = useState("all");
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then(data => setNotifications(data.notifications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = useMemo(
    () => notifications.filter(FILTER_MAP[activeFilter] ?? (() => true)),
    [notifications, activeFilter]
  );

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n._id === id || n.id === id ? { ...n, read: true } : n));
    try { await api.put(`/notifications/${id}/read`); } catch { /* optimistic */ }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await api.put("/notifications/read-all"); } catch { /* optimistic */ }
  };

  return { filtered, unreadCount, activeFilter, setActiveFilter, markRead, markAllRead, loading };
}
