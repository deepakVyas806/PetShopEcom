import { memo, useState } from "react";
import { Card } from "@/components/ui";
import { REVENUE_MONTHS } from "../data";

export default memo(function RevenueChart({ monthlyRevenue, loading }) {
  const [period, setPeriod] = useState("This Year");

  // Normalize real data to 0–100 heights; fall back to flat line while loading
  const heights = (() => {
    if (!monthlyRevenue || monthlyRevenue.every(v => v === 0)) {
      return loading ? Array(12).fill(20) : Array(12).fill(5);
    }
    const max = Math.max(...monthlyRevenue);
    return monthlyRevenue.map(v => max > 0 ? Math.max(5, Math.round((v / max) * 100)) : 5);
  })();

  const peakIdx = heights.indexOf(Math.max(...heights));

  return (
    <Card className="lg:col-span-2" padding="lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-on-surface">Revenue Overview</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 text-xs focus:border-primary focus:ring-0 outline-none text-on-surface cursor-pointer font-medium"
        >
          <option>This Year</option>
        </select>
      </div>

      <div className={`h-48 flex items-end gap-1.5 px-1 transition-opacity ${loading ? "opacity-40 animate-pulse" : "opacity-100"}`}>
        {heights.map((h, i) => (
          <div
            key={i}
            className="group flex-1 rounded-t-lg transition-all duration-300 hover:opacity-100 relative"
            style={{
              height: `${h}%`,
              backgroundColor: `rgba(99,14,212,${i === peakIdx ? 0.6 : 0.15})`,
              borderTop: i === peakIdx ? "2px solid #630ed4" : "none",
            }}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {REVENUE_MONTHS[i]}
              {monthlyRevenue?.[i] > 0 && ` · ₹${(monthlyRevenue[i] / 1000).toFixed(0)}k`}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-2">
        {REVENUE_MONTHS.map((m) => (
          <span key={m} className="text-[9px] text-on-surface-variant flex-1 text-center">{m}</span>
        ))}
      </div>
    </Card>
  );
});
