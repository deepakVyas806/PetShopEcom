"use client";
import { memo } from "react";
import { IconInfo } from "@/lib/icons";
import { FORM_CATEGORIES, TARGET_PETS } from "../../data";

const TOOLBAR = [
  { label: "B", title: "Bold",   style: "font-black" },
  { label: "I", title: "Italic", style: "italic" },
  { label: "≡", title: "List",   style: "" },
  { label: "⌗", title: "H3",    style: "" },
];

export default memo(function GeneralInfoCard({ form, setField }) {
  const charCount = form.description.length;
  const charClass = charCount > 900 ? (charCount > 1000 ? "text-error" : "text-warning") : "text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <IconInfo size={16} className="text-primary" weight="duotone" />
        <h3 className="text-xs font-bold text-on-surface">General Information</h3>
      </div>

      <div className="space-y-4">
        {/* Service Name */}
        <div>
          <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
            Service Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g., Premium Spa Grooming"
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Category + Target Pets */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Category</label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none pr-8"
              >
                {FORM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[10px]">▾</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Target Pets</label>
            <div className="relative">
              <select
                value={form.targetPets}
                onChange={(e) => setField("targetPets", e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none pr-8"
              >
                {TARGET_PETS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[10px]">▾</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Description</label>
          <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low">
            <div className="flex items-center gap-1 px-3 py-2 border-b border-outline-variant/50 bg-surface-container">
              {TOOLBAR.map(({ label, title, style }) => (
                <button
                  key={title}
                  type="button"
                  title={title}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-[11px] text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer ${style}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value.slice(0, 1000))}
              placeholder="Describe the service in detail — what's included, how long it takes, what to expect..."
              className="w-full bg-transparent px-3.5 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none resize-none"
            />
          </div>
          <p className={`text-[10px] mt-1 text-right ${charClass}`}>
            {charCount} / 1000
          </p>
        </div>
      </div>
    </div>
  );
});
