"use client";
import { memo } from "react";
import { IconSliders, IconPaw } from "@/lib/icons";
import { ANIMAL_TYPES, LIFE_STAGES } from "../../data";

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

export default memo(function SpecificationsCard({ weight, dimensions, lifeStage, animalTypes, lifeStages, petTypes, onField, onToggleAnimalType }) {
  const STAGES   = lifeStages?.length ? lifeStages : LIFE_STAGES;
  const PET_OPTS = petTypes?.length   ? petTypes   : ANIMAL_TYPES;
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
          <select
            value={lifeStage}
            onChange={(e) => onField("lifeStage", e.target.value)}
            className={`${inp} cursor-pointer`}
          >
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Animal types */}
      <div>
        <label className={`${lbl} flex items-center gap-1.5`}>
          <IconPaw size={11} className="text-primary" weight="fill" />
          Suitable For
          {animalTypes.length > 0 && (
            <span className="ml-auto text-[10px] font-normal normal-case tracking-normal text-primary">
              {animalTypes.join(", ")}
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-2">
          {PET_OPTS.map((type) => {
            const active = animalTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => onToggleAnimalType(type)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});
