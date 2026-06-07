"use client";
import { memo, useState } from "react";
import { IconImages, IconUpload, IconAdd, IconClose } from "@/lib/icons";

export default memo(function MediaUploadCard({ images, onField }) {
  const [activeSlot, setActiveSlot] = useState(null);

  const setImageUrl = (idx, val) => {
    const next = [...images];
    next[idx] = val;
    onField("images", next);
  };

  const clearSlot = (e, idx) => {
    e.stopPropagation();
    setImageUrl(idx, "");
    if (activeSlot === idx) setActiveSlot(null);
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xs font-bold text-on-surface flex items-center gap-2">
          <IconImages size={16} className="text-primary" weight="bold" />
          Media Upload
        </h3>
        <span className="text-[10px] text-on-surface-variant">Up to 5 images</span>
      </div>

      {/* Drop zone (styled) */}
      <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary transition-all cursor-pointer group mb-4">
        <div className="w-11 h-11 bg-primary-fixed rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <IconUpload size={20} className="text-primary" weight="bold" />
        </div>
        <p className="text-xs font-semibold text-on-surface">Drag & drop images here</p>
        <p className="text-[10px] text-on-surface-variant mt-1">or paste image URLs in the slots below</p>
        <p className="text-[10px] text-outline mt-0.5">Supports: JPG, PNG, WEBP · Max 5 MB each</p>
      </div>

      {/* Image slots */}
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div
              onClick={() => setActiveSlot(activeSlot === i ? null : i)}
              className="aspect-square rounded-xl border border-outline-variant/50 overflow-hidden cursor-pointer hover:border-primary transition-all relative group"
            >
              {images[i] ? (
                <>
                  <img
                    src={images[i]}
                    alt={`Product image ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => clearSlot(e, i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-on-surface/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconClose size={10} className="text-white" weight="bold" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-surface-container-low flex flex-col items-center justify-center gap-1">
                  <IconAdd size={16} className="text-outline" />
                  <span className="text-[8px] text-outline">Image {i + 1}</span>
                </div>
              )}
              {i === 0 && !images[0] && (
                <span className="absolute bottom-1 left-1 bg-primary/80 text-on-primary text-[8px] font-bold px-1 rounded">
                  Main
                </span>
              )}
            </div>

            {activeSlot === i && (
              <input
                type="url"
                value={images[i]}
                onChange={(e) => setImageUrl(i, e.target.value)}
                placeholder="Paste URL…"
                autoFocus
                className="w-full px-2 py-1.5 bg-surface-container-low border border-primary/50 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-on-surface-variant"
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-on-surface-variant mt-3">
        Click a slot to paste an image URL. The first image is used as the main listing photo.
      </p>
    </section>
  );
});
