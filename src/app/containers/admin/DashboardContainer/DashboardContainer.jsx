"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatGrid        from "./Components/StatGrid";
import RevenueChart    from "./Components/RevenueChart";
import SalesAnalytics  from "./Components/SalesAnalytics";
import RecentActivity  from "./Components/RecentActivity";
import BestSellingCard from "./Components/BestSellingCard";

export default function DashboardContainer() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <StatGrid stats={data?.stats} loading={loading} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RevenueChart monthlyRevenue={data?.monthlyRevenue} loading={loading} />
        <SalesAnalytics categories={data?.categoryRevenue} weekRevenue={data?.stats?.weekRevenue} loading={loading} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentActivity orders={data?.recentOrders} loading={loading} />
        <BestSellingCard topProducts={data?.topProducts} loading={loading} />
      </section>
    </div>
  );
}
