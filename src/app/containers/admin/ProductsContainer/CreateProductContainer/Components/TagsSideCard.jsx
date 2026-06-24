"use client";
import { memo, useState } from "react";
import { IconAdd, IconClose } from "@/lib/icons";

export default memo(function TagsSideCard({ tags, suggestions, onAdd, onRemove }) {
  const [input, setInput] = useState("");
  const SUGGESTIONS = suggestions ?? [];

  const commit = () => {
    if (input.trim()) { onAdd(input.trim()); setInput(""); }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
  };

  const available = SUGGESTIONS.filter((s) => !tags.includes(s));

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-wide text-on-surface mb-4">Tags</h3>

      {/* Existing tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 bg-primary-fixed text-primary rounded-full text-[10px] font-semibold"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="hover:text-error transition-colors cursor-pointer"
              >
                <IconClose size={10} weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type tag &amp; press Enter…"
          className="w-full pl-3 pr-9 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant"
        />
        <button
          type="button"
          onClick={commit}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform cursor-pointer"
        >
          <IconAdd size={15} weight="bold" />
        </button>
      </div>

      {/* Suggestions */}
      {available.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] text-on-surface-variant mb-1.5">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {available.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onAdd(s)}
                className="px-2 py-0.5 text-[10px] text-on-surface-variant border border-outline-variant/40 rounded-full hover:border-primary hover:text-primary transition-all cursor-pointer"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});
