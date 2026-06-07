"use client";
import { memo } from "react";
import { IconGlobe } from "@/lib/icons";

const inp  = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl  = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

export default memo(function SeoCard({ urlSlug, metaTitle, metaDescription, onField }) {
  const descLen  = metaDescription.length;
  const descColor = descLen > 160 ? "text-error" : descLen > 130 ? "text-amber-600" : "text-on-surface-variant";
  const titleLen  = metaTitle.length;
  const titleColor = titleLen > 70 ? "text-error" : titleLen > 55 ? "text-amber-600" : "text-on-surface-variant";

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm">
      <h3 className="text-xs font-bold text-on-surface mb-1 flex items-center gap-2">
        <IconGlobe size={16} className="text-primary" weight="bold" />
        SEO &amp; Discoverability
      </h3>
      <p className="text-[10px] text-on-surface-variant mb-5">
        Helps customers find this product through search engines.
      </p>

      <div className="space-y-4">
        {/* URL Slug */}
        <div>
          <label className={lbl}>URL Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-on-surface-variant whitespace-nowrap shrink-0">/products/</span>
            <input
              type="text"
              value={urlSlug}
              onChange={(e) =>
                onField("urlSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="product-url-slug"
              className={inp}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">
            Auto-filled from product name. Use lowercase letters and hyphens only.
          </p>
        </div>

        {/* Meta Title */}
        <div>
          <label className={lbl}>Meta Title</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onField("metaTitle", e.target.value)}
            placeholder="artPetShop — Product Name"
            className={inp}
          />
          <p className={`text-[10px] mt-1 ${titleColor}`}>{titleLen}/70 characters</p>
        </div>

        {/* Meta Description */}
        <div>
          <label className={lbl}>Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => onField("metaDescription", e.target.value)}
            placeholder="A compelling 1-2 sentence summary for search results (ideal: 130–160 chars)"
            rows={3}
            className={`${inp} resize-none`}
          />
          <p className={`text-[10px] mt-1 ${descColor}`}>{descLen}/160 characters</p>
        </div>
      </div>
    </section>
  );
});
