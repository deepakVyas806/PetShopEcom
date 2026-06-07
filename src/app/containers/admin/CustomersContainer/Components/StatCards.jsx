"use client";
import { memo } from "react";
import { IconUsers, IconBag, IconMoney, IconVerified } from "@/lib/icons";
import { fmt } from "@/lib/currency";

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

const StatCards = memo(function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={IconUsers}
        iconColor="text-primary"
        iconBg="bg-primary/10"
        stripe="bg-primary"
        label="Total Pet Parents"
        value={stats.totalParents}
        sub="+12 this month"
        subColor="text-emerald-600"
      />
      <StatCard
        icon={IconBag}
        iconColor="text-tertiary"
        iconBg="bg-tertiary/10"
        stripe="bg-tertiary"
        label="Avg Orders / Customer"
        value={stats.avgOrders}
        sub="Last 90 days"
        subColor="text-on-surface-variant/60"
      />
      <StatCard
        icon={IconMoney}
        iconColor="text-secondary"
        iconBg="bg-secondary/10"
        stripe="bg-secondary"
        label="Total Lifetime Value"
        value={fmt(stats.totalLtv)}
        sub="All time"
        subColor="text-on-surface-variant/60"
      />
      <StatCard
        icon={IconVerified}
        iconColor="text-error"
        iconBg="bg-error/10"
        stripe="bg-error"
        label="VIP Members"
        value={stats.activeSubs}
        sub="Premium care plan"
        subColor="text-on-surface-variant/60"
      />
    </div>
  );
});

export default StatCards;
