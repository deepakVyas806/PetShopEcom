import { memo, useMemo } from "react";
import { Card } from "@/components/ui";
import { fmt } from "@/lib/currency";
import { Sk } from "@/components/ui";

const BAR_COLORS = ["bg-primary", "bg-tertiary", "bg-secondary", "bg-amber-400", "bg-error"];

export default memo(function SalesAnalytics({ categories, weekRevenue, loading }) {
  const isInitial = loading && !categories;

  const rows = useMemo(() => {
    if (!categories?.length) return [];
    const total = categories.reduce((s, c) => s + c.revenue, 0);
    return categories.map((c, i) => ({
      label: c.label,
      pct:   total > 0 ? Math.round((c.revenue / total) * 100) : 0,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));
  }, [categories]);

  const weekLabel = weekRevenue != null ? fmt(weekRevenue) : null;

  return (
    <Card padding="lg">
      <h3 className="text-xs font-bold text-on-surface mb-4">Sales Analytics</h3>

      {isInitial ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Sk h="h-3" w="w-20" />
                <Sk h="h-3" w="w-8" />
              </div>
              <Sk h="h-1.5" rounded="rounded-full" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-1.5 text-center">
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mb-1" />
          <p className="text-xs font-semibold text-on-surface-variant">No sales data yet</p>
          <p className="text-[10px] text-on-surface-variant/60">Category breakdown will appear once orders are placed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map(({ label, pct, color }) => (
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
      )}

      <div className="mt-5 pt-4 border-t border-outline-variant/20 text-center">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">
          Total Sales this week
        </p>
        {isInitial ? (
          <div className="flex justify-center mt-1"><Sk h="h-5" w="w-20" /></div>
        ) : (
          <h4 className="text-sm font-extrabold text-primary">
            {weekLabel ?? "No data"}
          </h4>
        )}
      </div>
    </Card>
  );
});
