"use client";
import { memo } from "react";
import { IconSliders, IconPaw } from "@/lib/icons";

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

export default memo(function SpecificationsCard({ weight, dimensions, lifeStage, animalTypes, lifeStages, petTypes, catalogLoading, onField, onToggleAnimalType }) {
  // Normalize to {value, label} — catalog API returns {_id → value, name → label}
  const stageOpts = (lifeStages ?? []).map(s => typeof s === "string" ? { value: s, label: s } : s);
  const petOpts   = (petTypes   ?? []).map(p => typeof p === "string" ? { value: p, label: p } : p);
  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-xs font-bold text-on-surface mb-5 flex items-center gap-2">
        <IconSliders size={16} className="text-primary" weight="bold" />
        Specifications
      </h3>

      {/* Physical attributes */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label className={lbl}>Weight (kg)</label>
          <input
            type="text"
            value={weight}
            onChange={(e) => onField("weight", e.target.value)}
            placeholder="e.g. 2.5"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Dimensions (cm)</label>
          <input
            type="text"
            value={dimensions}
            onChange={(e) => onField("dimensions", e.target.value)}
            placeholder="L × W × H"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Life Stage</label>
          {catalogLoading ? (
            <div className={`${inp} opacity-50 animate-pulse`}>Loading…</div>
          ) : (
            <select
              value={lifeStage}
              onChange={(e) => onField("lifeStage", e.target.value)}
              className={`${inp} cursor-pointer`}
            >
              <option value="">Select stage…</option>
              {stageOpts.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Animal types */}
      <div>
        <label className={`${lbl} flex items-center gap-1.5`}>
          <IconPaw size={11} className="text-primary" weight="fill" />
          Suitable For
          {animalTypes.length > 0 && !catalogLoading && (
            <span className="ml-auto text-[10px] font-normal normal-case tracking-normal text-primary">
              {petOpts.filter(o => animalTypes.includes(o.value)).map(o => o.label).join(", ")}
            </span>
          )}
        </label>
        {catalogLoading ? (
          <div className="flex gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-7 w-14 rounded-full bg-surface-container-high animate-pulse" />
            ))}
          </div>
        ) : (
        <div className="flex flex-wrap gap-2">
          {petOpts.map(({ value, label }) => {
            const active = animalTypes.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => onToggleAnimalType(value)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
});
