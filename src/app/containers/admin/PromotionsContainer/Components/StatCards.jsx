"use client";
import { memo, useMemo } from "react";
import { IconTag, IconMoney, IconPercent, IconReceipt } from "@/lib/icons";
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

export default memo(function StatCards({ coupons }) {
  const stats = useMemo(() => {
    const active      = coupons.filter((c) => c.status === "active");
    const scheduled   = coupons.filter((c) => c.status === "scheduled");
    const totalUses   = coupons.reduce((s, c) => s + c.usageCount, 0);
    const totalRev    = coupons.reduce((s, c) => s + c.revenueRaw, 0);
    const pctCoupons  = coupons.filter((c) => c.discountType === "percent" && c.value > 0);
    const avgDiscount = pctCoupons.length
      ? (pctCoupons.reduce((s, c) => s + c.value, 0) / pctCoupons.length).toFixed(1)
      : "0.0";
    return { active: active.length, scheduled: scheduled.length, totalUses, totalRev, avgDiscount };
  }, [coupons]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        icon={IconReceipt}
        iconColor="text-primary"
        iconBg="bg-primary/10"
        stripe="bg-primary"
        label="Total Redemptions"
        value={stats.totalUses.toLocaleString("en-IN")}
        sub="+14% from last month"
        subColor="text-emerald-600"
      />
      <StatCard
        icon={IconMoney}
        iconColor="text-secondary"
        iconBg="bg-secondary/10"
        stripe="bg-secondary"
        label="Revenue Generated"
        value={fmt(stats.totalRev)}
        sub="+8% from last month"
        subColor="text-emerald-600"
      />
      <StatCard
        icon={IconTag}
        iconColor="text-tertiary"
        iconBg="bg-tertiary/10"
        stripe="bg-tertiary"
        label="Active Coupons"
        value={stats.active}
        sub={`${stats.scheduled} scheduled`}
        subColor="text-on-surface-variant/60"
      />
      <StatCard
        icon={IconPercent}
        iconColor="text-error"
        iconBg="bg-error/10"
        stripe="bg-error"
        label="Avg. Discount"
        value={`${stats.avgDiscount}%`}
        sub="Stable across categories"
        subColor="text-on-surface-variant/60"
      />
    </div>
  );
});
