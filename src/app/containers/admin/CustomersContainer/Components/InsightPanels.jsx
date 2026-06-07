"use client";
import { memo, useMemo } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const CHART_POINTS = [18, 22, 19, 26, 30, 35]; // cumulative-style growth

function GrowthChart() {
  const W = 280;
  const H = 80;
  const pad = { t: 8, r: 8, b: 20, l: 8 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const minV = Math.min(...CHART_POINTS);
  const maxV = Math.max(...CHART_POINTS);
  const range = maxV - minV || 1;

  const pts = CHART_POINTS.map((v, i) => {
    const x = pad.l + (i / (CHART_POINTS.length - 1)) * innerW;
    const y = pad.t + innerH - ((v - minV) / range) * innerH;
    return [x, y];
  });

  const linePath  = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath  = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${(pad.t + innerH).toFixed(1)} L${pts[0][0].toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#cg-grad)" />
        <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="var(--color-primary)" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {MONTHS.map((m) => (
          <span key={m} className="text-[9px] text-on-surface-variant">{m}</span>
        ))}
      </div>
    </div>
  );
}

const SEGMENTS = [
  { label: "VIP Members",          color: "bg-primary",   statusKey: "vip"      },
  { label: "Subscription Active",  color: "bg-tertiary",  statusKey: "active"   },
  { label: "Occasional Buyers",    color: "bg-secondary", statusKey: "inactive" },
];

function SegmentBars({ customers }) {
  const counts = useMemo(() => {
    const total = customers.length || 1;
    return SEGMENTS.map((seg) => {
      const count = customers.filter((c) => c.status === seg.statusKey).length;
      return { ...seg, count, pct: Math.round((count / total) * 100) };
    });
  }, [customers]);

  return (
    <div className="space-y-3">
      {counts.map(({ label, color, count, pct }) => (
        <div key={label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-on-surface">{label}</span>
            <span className="text-[10px] font-bold text-on-surface">{pct}%</span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[9px] text-on-surface-variant mt-0.5">{count} customers</p>
        </div>
      ))}
    </div>
  );
}

const InsightPanels = memo(function InsightPanels({ customers }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Growth chart */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
        <div className="mb-4">
          <h4 className="text-xs font-bold text-on-surface">Customer Growth</h4>
          <p className="text-[10px] text-on-surface-variant mt-0.5">New registrations · Jan–Jun</p>
        </div>
        <GrowthChart />
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-xs font-bold text-green-600">+35 customers</span>
          <span className="text-[10px] text-on-surface-variant">this 6-month period</span>
        </div>
      </div>

      {/* Segments */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
        <div className="mb-4">
          <h4 className="text-xs font-bold text-on-surface">Customer Segments</h4>
          <p className="text-[10px] text-on-surface-variant mt-0.5">Based on purchasing behaviour</p>
        </div>
        <SegmentBars customers={customers} />
      </div>
    </div>
  );
});

export default InsightPanels;
