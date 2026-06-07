import { memo } from "react";
import { STAT_CARDS } from "../data";

const StatCard = memo(function StatCard({ icon: Icon, iconBg, iconColor, stripe, label, value, sub, subColor }) {
  return (
    <div className="relative bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-3.5 flex items-center gap-3 overflow-hidden hover:shadow-sm hover:border-outline-variant/50 transition-all">
      {/* Left accent strip */}
      <div className={`absolute left-0 inset-y-0 w-[3px] rounded-r-full ${stripe}`} />

      {/* Icon */}
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ml-1`}>
        <Icon size={16} weight="duotone" className={iconColor} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-on-surface-variant/60 leading-none">{label}</p>
        <p className="text-sm font-black text-on-surface mt-1.5 leading-none truncate">{value}</p>
        {sub && <p className={`text-[9px] mt-1 leading-none font-medium ${subColor ?? "text-on-surface-variant/60"}`}>{sub}</p>}
      </div>
    </div>
  );
});

export default memo(function StatGrid() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
    </section>
  );
});
