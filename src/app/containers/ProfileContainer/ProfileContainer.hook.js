import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function useProfileContainer() {
  const { user, logout } = useAuth();

  const [recentOrder,    setRecentOrder]    = useState(null);
  const [ordersCount,    setOrdersCount]    = useState(0);
  const [pendingCount,   setPendingCount]   = useState(0);
  const [wishlistCount,  setWishlistCount]  = useState(0);
  const [rewardPoints,   setRewardPoints]   = useState(0);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/orders?limit=1"),
      api.get("/auth/stats"),
    ]).then(([ordersData, statsData]) => {
      setOrdersCount(ordersData.totalCount ?? 0);
      setRecentOrder((ordersData.orders ?? [])[0] ?? null);
      setPendingCount(statsData.pendingCount ?? 0);
      setWishlistCount(statsData.wishlistCount ?? 0);
      setRewardPoints(statsData.rewardPoints ?? 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    totalOrders:     ordersCount,
    pendingOrders:   pendingCount,
    wishlistItems:   wishlistCount,
    wishlistInStock: wishlistCount,
    rewardPoints:    rewardPoints,
    rewardValue:     (rewardPoints / 100).toFixed(2),
  }), [ordersCount, pendingCount, wishlistCount, rewardPoints]);

  return { user, stats, recentOrder, loading, logout };
}
