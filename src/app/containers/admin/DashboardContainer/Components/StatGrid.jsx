import { memo } from "react";
import { fmt } from "@/lib/currency";
import { SkStatCard } from "@/components/ui";
import {
  IconMoney, IconBag, IconUser, IconPackage,
  IconGroom, IconTag,
} from "@/lib/icons";
import { STAT_CARDS } from "../data";

const CARD_CONFIG = [
  { icon: IconMoney,   iconBg: "bg-primary/10",   iconColor: "text-primary",   stripe: "bg-primary",   label: "Total Revenue",  subColor: "text-success" },
  { icon: IconBag,     iconBg: "bg-secondary/10", iconColor: "text-secondary", stripe: "bg-secondary", label: "Orders",         subColor: "text-success" },
  { icon: IconUser,    iconBg: "bg-tertiary/10",  iconColor: "text-tertiary",  stripe: "bg-tertiary",  label: "Customers",      subColor: "text-on-surface-variant/60" },
  { icon: IconPackage, iconBg: "bg-warning/10",    iconColor: "text-warning",   stripe: "bg-warning",   label: "Products",       subColor: "text-on-surface-variant/60" },
  { icon: IconGroom,   iconBg: "bg-secondary/10", iconColor: "text-secondary", stripe: "bg-secondary", label: "Services",       subColor: "text-on-surface-variant/60" },
  { icon: IconTag,     iconBg: "bg-error/10",     iconColor: "text-error",     stripe: "bg-error",     label: "Active Coupons", subColor: "text-on-surface-variant/60" },
];

function buildCards(stats) {
  if (!stats) return STAT_CARDS; // fall back to static while loading
  return [
    { ...CARD_CONFIG[0], value: fmt(stats.totalRevenue),            sub: `${fmt(stats.monthRevenue)} this month` },
    { ...CARD_CONFIG[1], value: stats.totalOrders.toLocaleString(), sub: `${stats.pendingOrders} pending` },
    { ...CARD_CONFIG[2], value: stats.totalCustomers.toLocaleString(), sub: "Registered pet parents" },
    { ...CARD_CONFIG[3], value: stats.totalProducts.toLocaleString(), sub: "In catalogue" },
    { ...CARD_CONFIG[4], value: stats.totalServices.toLocaleString(), sub: "Available now" },
    { ...CARD_CONFIG[5], value: stats.totalCoupons.toLocaleString(), sub: "Active promotions" },
  ];
}

const StatCard = memo(function StatCard({ icon: Icon, iconBg, iconColor, stripe, label, value, sub, subColor }) {
  return (
    <div className="relative bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-3.5 flex items-center gap-3 overflow-hidden hover:shadow-card-sm hover:border-outline-variant/50 transition-all">
      <div className={`absolute left-0 inset-y-0 w-[3px] rounded-r-full ${stripe}`} />
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ml-1`}>
        <Icon size={16} weight="duotone" className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-on-surface-variant/60 leading-none">{label}</p>
        <p className="text-sm font-black text-on-surface mt-1.5 leading-none truncate">{value}</p>
        {sub && <p className={`text-[9px] mt-1 leading-none font-medium ${subColor ?? "text-on-surface-variant/60"}`}>{sub}</p>}
      </div>
    </div>
  );
});

export default memo(function StatGrid({ stats, loading }) {
  if (loading && !stats) {
    return (
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <SkStatCard key={i} />)}
      </section>
    );
  }
  const cards = buildCards(stats);
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((s) => <StatCard key={s.label} {...s} />)}
    </section>
  );
});
