import { memo, useState } from "react";
import { Card, Sk } from "@/components/ui";
import { IconPackage } from "@/lib/icons";
import { fmt } from "@/lib/currency";

const PERIODS = [
  { key: "allTime", label: "All Time" },
  { key: "month",   label: "Month"    },
  { key: "week",    label: "Week"     },
  { key: "today",   label: "Today"    },
];

export default memo(function BestSellingCard({ topProducts, loading }) {
  const [period, setPeriod] = useState("allTime");

  const list = topProducts?.[period] ?? [];
  const isInitial = loading && !topProducts;

  return (
    <Card padding="lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-xs font-bold text-on-surface">Top Products</h3>
          <p className="text-[10px] text-on-surface-variant mt-0.5">Our most loved picks</p>
        </div>

        {/* Period tabs */}
        <div className="flex items-center gap-0.5 bg-surface-container rounded-xl p-0.5 shrink-0">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                period === key
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isInitial ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Sk className="w-9 h-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1">
                <Sk className="h-3 w-3/4 rounded" />
                <Sk className="h-2.5 w-1/2 rounded" />
              </div>
              <Sk className="h-3 w-12 rounded" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
            <IconPackage size={18} className="text-on-surface-variant/40" weight="duotone" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant">No sales data yet</p>
          <p className="text-[10px] text-on-surface-variant/60 text-center">
            Top products will appear once orders are placed
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((product, idx) => (
            <div
              key={product._id ?? idx}
              className="flex items-center gap-3 py-2 px-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              {/* Rank */}
              <span className={`text-[10px] font-black w-4 text-center shrink-0 ${
                idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-amber-700" : "text-on-surface-variant/40"
              }`}>
                {idx + 1}
              </span>

              {/* Image */}
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-surface-container shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconPackage size={14} className="text-on-surface-variant/40" />
                  </div>
                )}
              </div>

              {/* Name + units */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-on-surface truncate">{product.name}</p>
                <p className="text-[10px] text-on-surface-variant">{product.totalSold} units sold</p>
              </div>

              {/* Revenue */}
              <span className="text-[11px] font-bold text-on-surface shrink-0">{fmt(product.revenue ?? 0)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});
