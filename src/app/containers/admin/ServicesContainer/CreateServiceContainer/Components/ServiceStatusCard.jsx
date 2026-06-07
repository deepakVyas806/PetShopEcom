"use client";
import { memo, useState } from "react";
import { IconEye, IconTag, IconClose } from "@/lib/icons";
import { SERVICE_TAG_SUGGESTIONS } from "../../data";

const VISIBILITY_OPTS = [
  { value: "public",  label: "Public",  desc: "Visible to all customers" },
  { value: "private", label: "Private", desc: "Internal use only" },
];

export default memo(function ServiceStatusCard({ form, setField }) {
  const [tagInput, setTagInput] = useState("");

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-");
    if (!tag || form.tags.includes(tag)) return;
    setField("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag) => setField("tags", form.tags.filter((t) => t !== tag));

  const suggestions = SERVICE_TAG_SUGGESTIONS.filter((t) => !form.tags.includes(t)).slice(0, 6);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <IconEye size={16} className="text-primary" weight="duotone" />
        <h3 className="text-xs font-bold text-on-surface">Service Status</h3>
      </div>

      <div className="space-y-4">
        {/* Active toggle */}
        <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
          <div>
            <p className="text-xs font-semibold text-on-surface">Active Status</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {form.active ? "Accepting bookings" : "Paused — not bookable"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setField("active", !form.active)}
            aria-label="Toggle active"
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${
              form.active ? "bg-primary" : "bg-outline-variant"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                form.active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-[10px] font-semibold text-on-surface-variant mb-2">Visibility</label>
          <div className="space-y-1.5">
            {VISIBILITY_OPTS.map(({ value, label, desc }) => (
              <label
                key={value}
                className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    form.visibility === value ? "border-primary bg-primary" : "border-outline-variant"
                  }`}
                >
                  {form.visibility === value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={form.visibility === value}
                  onChange={() => setField("visibility", value)}
                  className="sr-only"
                />
                <div>
                  <p className="text-xs font-semibold text-on-surface leading-none">{label}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <IconTag size={11} className="text-on-surface-variant" weight="bold" />
            <label className="text-[10px] font-semibold text-on-surface-variant">Tags</label>
          </div>
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-surface-container-low border border-outline-variant rounded-xl min-h-[44px]">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-lg text-[10px] font-semibold"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <IconClose size={9} weight="bold" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); }
              }}
              placeholder={form.tags.length === 0 ? "Add tag…" : ""}
              className="bg-transparent border-none outline-none text-[10px] text-on-surface flex-1 min-w-[60px] placeholder:text-on-surface-variant/50"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="px-2 py-0.5 bg-surface-container rounded-lg text-[10px] text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  +{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
