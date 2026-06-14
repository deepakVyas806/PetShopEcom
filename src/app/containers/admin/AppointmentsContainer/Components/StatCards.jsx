"use client";
import { memo } from "react";
import { IconCalendar, IconCalendarCheck, IconPending, IconMoney } from "@/lib/icons";
import { fmt } from "@/lib/currency";

const StatCard = memo(function StatCard({ label, value, sub, icon: Icon, iconColor, iconBg, stripe, subColor }) {
  return (
    <div className="relative bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-3.5 flex items-center gap-3 overflow-hidden hover:shadow-sm hover:border-outline-variant/50 transition-all">
      <div className={`absolute left-0 inset-y-0 w-[3px] rounded-r-full ${stripe}`} />
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ml-1`}>
        <Icon size={16} weight="duotone" className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-on-surface-variant/60 leading-none">{label}</p>
        <p className="text-sm font-black text-on-surface mt-1.5 leading-none truncate">{value}</p>
        {sub && <p className={`text-[9px] mt-1 leading-none font-medium ${subColor ?? "text-emerald-600"}`}>{sub}</p>}
      </div>
    </div>
  );
});

export default memo(function StatCards({ stats }) {
  const todayCount   = stats?.todayCount   ?? 0;
  const pendingCount = stats?.pendingCount ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard label="Today's Slots"   value={String(todayCount)}   sub="Active today"            icon={IconCalendar}      iconColor="text-primary"     iconBg="bg-primary/10"   stripe="bg-primary"      />
      <StatCard label="This Month"      value="—"                    sub="Total bookings"          icon={IconCalendarCheck} iconColor="text-secondary"   iconBg="bg-secondary/10" stripe="bg-secondary"    />
      <StatCard label="Pending"         value={String(pendingCount)} sub="Awaiting confirmation"   icon={IconPending}       iconColor="text-amber-500"   iconBg="bg-amber-50"     stripe="bg-amber-400"    subColor="text-on-surface-variant/60" />
      <StatCard label="Monthly Revenue" value="—"                    sub="Completed appointments"  icon={IconMoney}         iconColor="text-emerald-600" iconBg="bg-emerald-50"   stripe="bg-emerald-500"  subColor="text-on-surface-variant/60" />
    </div>
  );
});
