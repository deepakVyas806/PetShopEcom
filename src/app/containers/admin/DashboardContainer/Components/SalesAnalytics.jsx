import { memo } from "react";
import { Card } from "@/components/ui";
import { fmt } from "@/lib/currency";
import { SALES_CATEGORIES } from "../data";

export default memo(function SalesAnalytics() {
  return (
    <Card padding="lg">
      <h3 className="text-xs font-bold text-on-surface mb-4">Sales Analytics</h3>

      <div className="space-y-4">
        {SALES_CATEGORIES.map(({ label, pct, color }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">{label}</span>
              <span className="font-bold text-on-surface">{pct}%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div
                className={`${color} h-full rounded-full transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-outline-variant/20 text-center">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">
          Total Sales this week
        </p>
        <h4 className="text-sm font-extrabold text-primary">{fmt(12402)}</h4>
      </div>
    </Card>
  );
});
