"use client";
import { memo } from "react";
import { IconSliders, IconClock, IconMoney, IconUsers } from "@/lib/icons";
import { DURATION_OPTS } from "../../data";
import { fmt } from "@/lib/currency";

export default memo(function ServiceSettingsCard({ form, setField }) {
  const priceNum = Number(form.priceRaw);
  const priceValid = !isNaN(priceNum) && priceNum > 0;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <IconSliders size={16} className="text-primary" weight="duotone" />
        <h3 className="text-xs font-bold text-on-surface">Service Settings</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Duration */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant mb-1.5">
            <IconClock size={11} weight="bold" /> Duration
          </label>
          <div className="relative">
            <select
              value={form.duration}
              onChange={(e) => setField("duration", e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none pr-8"
            >
              {DURATION_OPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[10px]">▾</span>
          </div>
        </div>

        {/* Base Price */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant mb-1.5">
            <IconMoney size={11} weight="bold" /> Base Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">₹</span>
            <input
              type="number"
              min="0"
              value={form.priceRaw}
              onChange={(e) => setField("priceRaw", e.target.value)}
              placeholder="0"
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-6 pr-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          {priceValid && (
            <p className="text-[10px] text-primary mt-1 font-semibold">{fmt(priceNum)}</p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant mb-1.5">
            <IconUsers size={11} weight="bold" /> Slots / Day
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={form.capacity}
            onChange={(e) => setField("capacity", Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            placeholder="1"
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="text-[10px] text-on-surface-variant mt-1">Max simultaneous bookings</p>
        </div>
      </div>
    </div>
  );
});
