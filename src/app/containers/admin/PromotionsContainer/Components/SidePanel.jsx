"use client";
import { memo } from "react";
import { IconLightning } from "@/lib/icons";
import { CAMPAIGN_HERO, LIVE_ACTIVITY } from "../data";

export default memo(function SidePanel() {
  return (
    <div className="space-y-4">
      {/* ── Featured campaign card ── */}
      <div className="bg-gradient-to-br from-primary to-tertiary p-5 rounded-2xl text-on-primary relative overflow-hidden group">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-1.5">
            <IconLightning size={14} weight="fill" className="text-white/80" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Seasonal Hero</p>
          </div>
          <h4 className="text-xs font-bold text-white leading-snug">{CAMPAIGN_HERO.name}</h4>
          <p className="text-[10px] text-white/80 leading-snug">{CAMPAIGN_HERO.description}</p>
          <div className="pt-2 grid grid-cols-3 gap-2 text-center">
            {[
              { value: CAMPAIGN_HERO.convRate, label: "Conv. Rate" },
              { value: CAMPAIGN_HERO.shares,   label: "Shares"     },
              { value: CAMPAIGN_HERO.roas,     label: "ROAS"       },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-xs font-bold text-white">{value}</p>
                <p className="text-[9px] text-white/60 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
      </div>

      {/* ── Live activity ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Activity</p>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        <div className="space-y-3.5">
          {LIVE_ACTIVITY.map(({ coupon, customer, timeAgo, dot }, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className={`w-2 h-2 rounded-full ${dot} mt-1.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-on-surface leading-snug">
                  <span className="font-bold text-primary">{coupon}</span> used by {customer}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{timeAgo}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-1.5 text-[10px] font-bold text-primary hover:underline cursor-pointer"
        >
          View live feed →
        </button>
      </div>
    </div>
  );
});
