import { memo, useState } from "react";
import { Card } from "@/components/ui";
import { REVENUE_MONTHS, REVENUE_HEIGHTS } from "../data";

export default memo(function RevenueChart() {
  const [period, setPeriod] = useState("Last 12 Months");

  return (
    <Card className="lg:col-span-2" padding="lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-on-surface">Revenue Overview</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 text-xs focus:border-primary focus:ring-0 outline-none text-on-surface cursor-pointer font-medium"
        >
          <option>Last 12 Months</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      {/* Bar chart */}
      <div className="h-48 flex items-end gap-1.5 px-1">
        {REVENUE_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="group flex-1 rounded-t-lg transition-all duration-300 hover:opacity-100 relative"
            style={{
              height: `${h}%`,
              backgroundColor: `rgba(99,14,212,${h === 100 ? 0.6 : 0.15})`,
              borderTop: h === 100 ? "2px solid #630ed4" : "none",
            }}
          >
            {/* Tooltip */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {REVENUE_MONTHS[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Month labels */}
      <div className="flex justify-between mt-2">
        {REVENUE_MONTHS.map((m) => (
          <span key={m} className="text-[9px] text-on-surface-variant flex-1 text-center">{m}</span>
        ))}
      </div>
    </Card>
  );
});
