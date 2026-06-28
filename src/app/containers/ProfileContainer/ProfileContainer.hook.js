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
  const [referralCode,   setReferralCode]   = useState("");
  const [referralCount,  setReferralCount]  = useState(0);
  const [referralEarned, setReferralEarned] = useState(0);
  const [loyaltyTiers,   setLoyaltyTiers]   = useState([]);
  const [createdAt,      setCreatedAt]      = useState(null);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/orders?limit=1"),
      api.get("/auth/stats"),
      api.get("/settings"),
    ]).then(([ordersData, statsData, settingsData]) => {
      setOrdersCount(ordersData.totalCount ?? 0);
      setRecentOrder((ordersData.orders ?? [])[0] ?? null);
      setPendingCount(statsData.pendingCount ?? 0);
      setWishlistCount(statsData.wishlistCount ?? 0);
      setRewardPoints(statsData.rewardPoints ?? 0);
      setReferralCode(statsData.referralCode ?? "");
      setReferralCount(statsData.referralCount ?? 0);
      setReferralEarned(statsData.referralEarned ?? 0);
      setLoyaltyTiers(settingsData.settings?.loyaltyTiers ?? []);
      setCreatedAt(statsData.createdAt ?? null);
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

  // Merge createdAt into the user object so PersonalInfoCard can show "Member since"
  const enrichedUser = useMemo(
    () => (user && createdAt ? { ...user, createdAt } : user),
    [user, createdAt]
  );

  return { user: enrichedUser, stats, recentOrder, loading, logout, loyaltyTiers, referralCode, referralCount, referralEarned };
}
