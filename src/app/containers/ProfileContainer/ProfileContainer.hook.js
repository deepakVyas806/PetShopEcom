import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function useProfileContainer() {
  const { user, logout } = useAuth();

  const [recentOrder,  setRecentOrder]  = useState(null);
  const [ordersCount,  setOrdersCount]  = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    api.get("/orders?limit=1")
      .then(data => {
        setOrdersCount(data.totalCount ?? 0);
        setPendingCount(data.pendingCount ?? 0);
        setRecentOrder((data.orders ?? [])[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    totalOrders:     ordersCount,
    pendingOrders:   pendingCount,
    wishlistItems:   0,
    wishlistInStock: 0,
    rewardPoints:    0,
    rewardValue:     "0.00",
  }), [ordersCount, pendingCount]);

  return { user, stats, recentOrder, loading, logout };
}
