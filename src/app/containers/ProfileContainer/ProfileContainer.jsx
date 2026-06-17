"use client";

import { useState } from "react";
import useProfileContainer from "./ProfileContainer.hook";
import PageHeader       from "@/components/common/PageHeader";
import ProfileStatsRow  from "./Components/ProfileStatsRow";
import PersonalInfoCard from "./Components/PersonalInfoCard";
import RecentOrderCard  from "./Components/RecentOrderCard";
import AppointmentCard  from "./Components/AppointmentCard";
import { IconGift, IconStar, IconUsers, IconCopy, IconCheck, IconLightning } from "@/lib/icons";

const TIERS = [
  { name: "Silver",   min: 0,    max: 500,  color: "text-gray-500",  bg: "bg-gray-100"   },
  { name: "Gold",     min: 500,  max: 1500, color: "text-amber-600", bg: "bg-amber-100"  },
  { name: "Platinum", min: 1500, max: 3000, color: "text-purple-600", bg: "bg-purple-100" },
];

function LoyaltyCard({ points }) {
  const pts = Number(points) || 240;
  const tier = TIERS.findLast((t) => pts >= t.min) ?? TIERS[0];
  const next = TIERS[TIERS.indexOf(tier) + 1];
  const pct  = next ? Math.min(100, ((pts - tier.min) / (next.min - tier.min)) * 100) : 100;

  return (
    <div className="bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <IconStar size={18} className="text-primary" weight="fill" />
          </div>
          <div>
            <p className="text-xs font-black text-on-surface">Loyalty Rewards</p>
            <p className={`text-[10px] font-bold ${tier.color}`}>{tier.name} Member</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-primary leading-none">{pts.toLocaleString()}</p>
          <p className="text-[10px] text-on-surface-variant">points</p>
        </div>
      </div>

      {next && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-on-surface-variant">
            <span>{tier.name}</span>
            <span className="font-semibold text-on-surface">
              {(next.min - pts).toLocaleString()} pts to {next.name}
            </span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: "Earn",   val: "1pt / ₹10" },
          { label: "Redeem", val: "1pt = ₹0.25" },
          { label: "Bonus",  val: `${tier.name === "Gold" ? "2×" : tier.name === "Platinum" ? "3×" : "1×"} on sale` },
        ].map(({ label, val }) => (
          <div key={label} className="bg-surface-container/60 rounded-xl p-2 text-center">
            <p className="text-[9px] text-on-surface-variant">{label}</p>
            <p className="text-[10px] font-bold text-on-surface">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferEarnCard() {
  const [copied, setCopied] = useState(false);
  const code = "ARTPET-REF42";

  function copy() {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-2xl p-4 space-y-3 text-white"
      style={{ background: "linear-gradient(135deg, #630ed4 0%, #7c3aed 60%, #9b59f5 100%)" }}
    >
      <div className="flex items-center gap-2">
        <IconGift size={20} weight="fill" />
        <p className="text-sm font-black">Refer &amp; Earn</p>
      </div>
      <p className="text-xs text-white/80 leading-relaxed">
        Invite friends to artPet Shop. You earn <strong className="text-white">₹100</strong> and your friend gets <strong className="text-white">₹50</strong> on their first order.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/15 border border-white/25 rounded-lg px-3 py-2">
          <p className="text-xs font-black tracking-widest text-white">{code}</p>
        </div>
        <button
          onClick={copy}
          className="shrink-0 bg-white text-primary font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer border-none hover:bg-white/90 transition-colors active:scale-95"
        >
          {copied ? <IconCheck size={14} weight="bold" /> : <IconCopy size={14} weight="regular" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-white/70">
        <span className="flex items-center gap-1"><IconUsers size={12} /> 3 friends referred</span>
        <span className="flex items-center gap-1"><IconLightning size={12} weight="fill" /> ₹300 earned</span>
      </div>
    </div>
  );
}

export default function ProfileContainer() {
  const { user, stats, recentOrder } = useProfileContainer();

  return (
    <div className="space-y-4">

      <PageHeader
        breadcrumbs={[
          { label: "Home",       href: "/"        },
          { label: "My Account", href: "/profile" },
        ]}
        title="My Profile"
        subtitle="Manage your account details and preferences."
      />

      <ProfileStatsRow stats={stats} />
      <PersonalInfoCard user={user} />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <LoyaltyCard points={stats.rewardPoints} />
        <ReferEarnCard />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <RecentOrderCard order={recentOrder} />
        <AppointmentCard />
      </section>
    </div>
  );
}
