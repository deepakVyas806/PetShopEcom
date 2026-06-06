"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";
import { Card } from "@/components/ui";
import { IconPackage, IconHeart, IconStar } from "@/lib/icons";

function StatCard({ Icon, value, label, sub, fill, href }) {
  const Inner = (
    <Card padding="sm" className="flex items-center gap-3 hover:border-primary/30 transition-all group">
      <div className="bg-primary/10 p-2 rounded-lg shrink-0">
        <Icon size={18} className="text-primary leading-none" weight={fill ? "fill" : "regular"} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black text-on-surface leading-none">{value}</p>
        <p className="text-[10px] font-semibold text-on-surface-variant mt-0.5 truncate">{label}</p>
        <p className="text-[9px] text-outline mt-0.5 truncate">{sub}</p>
      </div>
    </Card>
  );

  return href ? <Link href={href}>{Inner}</Link> : Inner;
}

export default function ProfileStatsRow({ stats }) {
  return (
    <section className="grid grid-cols-3 gap-3">
      <StatCard Icon={IconPackage} value={stats.totalOrders} label="Orders" sub={`${stats.pendingOrders} pending`} href="/orders" />
      <StatCard Icon={IconHeart} value={stats.wishlistItems} label="Wishlist" sub={`${stats.wishlistInStock} in stock`} fill href="/wishlist" />
      <StatCard Icon={IconStar} value={stats.rewardPoints} label="Points" sub={`${fmt(Number(stats.rewardValue))} value`} fill />
    </section>
  );
}
