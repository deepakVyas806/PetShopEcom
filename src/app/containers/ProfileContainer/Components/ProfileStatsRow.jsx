"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";

const GLASS = "bg-white/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl shadow-sm";

function StatCard({ icon, value, label, sub, fill, href }) {
  const Inner = (
    <div className={`${GLASS} p-3.5 flex items-center gap-3 hover:border-primary/30 transition-all group`}>
      <div className="bg-primary/10 p-2 rounded-lg shrink-0">
        <span
          className="material-symbols-outlined text-primary text-lg leading-none"
          style={fill ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black text-on-surface leading-none">{value}</p>
        <p className="text-[10px] font-semibold text-on-surface-variant mt-0.5 truncate">{label}</p>
        <p className="text-[9px] text-outline mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );

  return href ? <Link href={href}>{Inner}</Link> : Inner;
}

export default function ProfileStatsRow({ stats }) {
  return (
    <section className="grid grid-cols-3 gap-3">
      <StatCard icon="package_2" value={stats.totalOrders} label="Orders" sub={`${stats.pendingOrders} pending`} href="/orders" />
      <StatCard icon="favorite" value={stats.wishlistItems} label="Wishlist" sub={`${stats.wishlistInStock} in stock`} fill href="/wishlist" />
      <StatCard icon="stars" value={stats.rewardPoints} label="Points" sub={`${fmt(Number(stats.rewardValue))} value`} fill />
    </section>
  );
}
