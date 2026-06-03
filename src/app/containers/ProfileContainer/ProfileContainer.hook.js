import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

export default function useProfileContainer() {
  const { user, logout } = useAuth();
  const { orders }       = useStore();

  const stats = useMemo(() => ({
    totalOrders:     orders.length > 0 ? orders.length : 12,
    pendingOrders:   orders.filter((o) => o.trackingStatus !== "Delivered").length || 4,
    wishlistItems:   8,
    wishlistInStock: 5,
    rewardPoints:    450,
    rewardValue:     "45.00",
  }), [orders]);

  const recentOrder = orders[0] ?? null;

  return { user, stats, recentOrder, logout };
}
