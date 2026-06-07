"use client";
import { memo, useState } from "react";
import { IconImages, IconCamera } from "@/lib/icons";

export default memo(function MediaGalleryCard({ form, setField }) {
  const [activeSlot, setActiveSlot] = useState(null); // 0 = main, 1-3 = small
  const [urlInput,   setUrlInput]   = useState("");

  const openSlot = (i) => {
    setActiveSlot(i);
    setUrlInput(form.images[i] ?? "");
  };

  const applyUrl = (i) => {
    const next = [...form.images];
    next[i] = urlInput.trim();
    setField("images", next);
    setActiveSlot(null);
    setUrlInput("");
  };

  const cancelSlot = () => {
    setActiveSlot(null);
    setUrlInput("");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <IconImages size={16} className="text-primary" weight="duotone" />
        <h3 className="text-xs font-bold text-on-surface">Media Gallery</h3>
      </div>

      {/* ── Main image ── */}
      {activeSlot === 0 ? (
        <div className="aspect-video rounded-xl border-2 border-primary/40 bg-surface-container-low p-3 mb-3 flex flex-col gap-2">
          <p className="text-[10px] font-semibold text-on-surface-variant">Main image URL</p>
          <input
            autoFocus
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyUrl(0); if (e.key === "Escape") cancelSlot(); }}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 text-[10px] text-on-surface focus:outline-none focus:border-primary"
          />
          <div className="flex gap-1.5">
            <button type="button" onClick={cancelSlot} className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">Cancel</button>
            <button type="button" onClick={() => applyUrl(0)} className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all cursor-pointer">Set Image</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => openSlot(0)}
          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group mb-3 border-2 transition-all ${
            form.images[0] ? "border-primary/30 shadow-sm" : "border-dashed border-outline-variant hover:border-primary"
          }`}
        >
          {form.images[0] ? (
            <>
              <img src={form.images[0]} alt="Main" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <IconCamera size={24} className="text-white drop-shadow" weight="bold" />
              </div>
              <div className="absolute top-2 left-2 bg-primary text-on-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Main
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-surface-container-low flex flex-col items-center justify-center gap-2">
              <IconCamera size={28} className="text-on-surface-variant/30" weight="duotone" />
              <p className="text-[10px] text-on-surface-variant">Click to set main image</p>
            </div>
          )}
        </div>
      )}

      {/* ── 3 small slots ── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            onClick={() => activeSlot !== i && openSlot(i)}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border transition-all ${
              activeSlot === i
                ? "border-primary/60 ring-2 ring-primary/20"
                : form.images[i]
                  ? "border-primary/30"
                  : "border-dashed border-outline-variant hover:border-primary"
            }`}
          >
            {form.images[i] ? (
              <>
                <img src={form.images[i]} alt={`Slot ${i}`} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <IconCamera size={14} className="text-white" weight="bold" />
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                <IconCamera size={18} className="text-on-surface-variant/30" weight="duotone" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* URL input for small slots */}
      {activeSlot !== null && activeSlot > 0 && (
        <div className="p-3 bg-surface-container-low border border-primary/30 rounded-xl mb-3 space-y-2">
          <p className="text-[10px] font-semibold text-on-surface-variant">Image {activeSlot} URL</p>
          <input
            autoFocus
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyUrl(activeSlot); if (e.key === "Escape") cancelSlot(); }}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 text-[10px] text-on-surface focus:outline-none focus:border-primary"
          />
          <div className="flex gap-1.5">
            <button type="button" onClick={cancelSlot} className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg border border-outline-variant text-on-surface-variant cursor-pointer">Cancel</button>
            <button type="button" onClick={() => applyUrl(activeSlot)} className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg bg-primary text-on-primary cursor-pointer">Set</button>
          </div>
        </div>
      )}

      <p className="text-[10px] text-on-surface-variant text-center">
        Recommended: 1200 × 800 px · JPG / PNG
      </p>
    </div>
  );
});
