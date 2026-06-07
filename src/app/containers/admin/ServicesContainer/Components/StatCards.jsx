"use client";
import { memo } from "react";
import { IconGroom, IconMoney, IconCalendarCheck, IconStar } from "@/lib/icons";

const StatCard = memo(function StatCard({ icon: Icon, iconColor, iconBg, stripe, label, value, sub, subColor }) {
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

export default memo(function StatCards({ activeCount, featuredCount, avgTicket, capacity }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        icon={IconGroom}
        iconColor="text-primary"
        iconBg="bg-primary/10"
        stripe="bg-primary"
        label="Active Services"
        value={activeCount}
        sub="+12% this month"
        subColor="text-emerald-600"
      />
      <StatCard
        icon={IconMoney}
        iconColor="text-tertiary"
        iconBg="bg-tertiary/10"
        stripe="bg-tertiary"
        label="Avg. Ticket Size"
        value={avgTicket}
        sub="+5% vs last month"
        subColor="text-emerald-600"
      />
      <StatCard
        icon={IconCalendarCheck}
        iconColor="text-secondary"
        iconBg="bg-secondary/10"
        stripe="bg-secondary"
        label="Capacity Utilization"
        value={capacity}
        sub="Peak hours: 11–2 PM"
        subColor="text-on-surface-variant/60"
      />
      <StatCard
        icon={IconStar}
        iconColor="text-amber-500"
        iconBg="bg-amber-50"
        stripe="bg-amber-400"
        label="Featured Services"
        value={`${featuredCount} items`}
        sub="Pinned on homepage"
        subColor="text-on-surface-variant/60"
      />
    </div>
  );
});
