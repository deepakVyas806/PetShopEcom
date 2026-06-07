"use client";

/**
 * Admin Dashboard — thin orchestrator.
 * All heavy sections are memo'd subcomponents that only re-render
 * when their own props change. Static data lives in data.js and is
 * never recreated across renders.
 */

import StatGrid       from "./Components/StatGrid";
import RevenueChart   from "./Components/RevenueChart";
import SalesAnalytics from "./Components/SalesAnalytics";
import RecentActivity from "./Components/RecentActivity";
import BestSellingCard from "./Components/BestSellingCard";

export default function DashboardContainer() {
  return (
    <div className="space-y-5">
      {/* Row 1: stat cards */}
      <StatGrid />

      {/* Row 2: charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RevenueChart />
        <SalesAnalytics />
      </section>

      {/* Row 3: activity + best seller */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentActivity />
        <BestSellingCard />
      </section>
    </div>
  );
}
