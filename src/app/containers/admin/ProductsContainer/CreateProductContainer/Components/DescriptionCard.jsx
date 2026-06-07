"use client";
import { memo } from "react";
import { IconEdit } from "@/lib/icons";

const TOOLBAR = [
  { key: "bold",   label: "B",  cls: "font-bold",      title: "Bold" },
  { key: "italic", label: "I",  cls: "italic",          title: "Italic" },
  { key: "ul",     label: "≡",  cls: "",               title: "Bullet List" },
  { key: "link",   label: "↗",  cls: "",               title: "Insert Link" },
  { key: "h3",     label: "H₃", cls: "text-[10px]",    title: "Heading" },
];

export default memo(function DescriptionCard({ description, onField }) {
  const charCount = description.length;
  const charColor = charCount > 2000 ? "text-error" : charCount > 1500 ? "text-amber-600" : "text-on-surface-variant";

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-xs font-bold text-on-surface mb-5 flex items-center gap-2">
        <IconEdit size={16} className="text-primary" weight="bold" />
        Product Description
      </h3>

      <div className="border border-outline-variant/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-all">
        {/* Formatting toolbar */}
        <div className="bg-surface-container-low border-b border-outline-variant/30 px-3 py-2 flex items-center gap-0.5">
          {TOOLBAR.map(({ key, label, cls, title }) => (
            <button
              key={key}
              type="button"
              title={title}
              className={`px-2.5 py-1 text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors cursor-pointer ${cls}`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto text-[10px] text-on-surface-variant pr-1">{charCount} chars</div>
        </div>

        <textarea
          value={description}
          onChange={(e) => onField("description", e.target.value)}
          placeholder="Describe your product in detail — key ingredients, materials, benefits, usage instructions, and what makes it special for your pet…"
          rows={7}
          className="w-full bg-transparent px-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none resize-none"
        />
      </div>

      <p className={`text-[10px] mt-1.5 ${charColor}`}>
        {charCount > 2000 ? "Description is too long." : "Aim for 150–2000 characters for best results."}
      </p>
    </section>
  );
});
