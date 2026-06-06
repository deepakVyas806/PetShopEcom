"use client";

/**
 * InlineReviewForm — shared across:
 *   - /marketplace/[productId]  (ProductDetailsContainer)
 *   - /services/[serviceId]     (ServiceDetailsContainer)
 *   - /reviews                  (ReviewsContainer)
 *
 * Uses primary color for stars — consistent with StarRating display component.
 */

import { useState } from "react";
import { IconStar, IconClose } from "@/lib/icons";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/* ── Interactive star picker (primary colour, matches StarRating display) ── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="bg-transparent border-none cursor-pointer p-0.5 rounded transition-transform hover:scale-110 active:scale-95"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <IconStar
            size={22}
            className="text-primary leading-none"
            weight={n <= active ? "fill" : "regular"}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-primary font-semibold ml-1.5">
          {RATING_LABELS[value]}
        </span>
      )}
    </div>
  );
}

/* ── Props ──────────────────────────────────────────────────────────────── */
interface ReviewPayload {
  rating: number;
  title:  string;
  body:   string;
}

interface Props {
  onSubmit: (review: ReviewPayload) => void;
  onCancel: () => void;
  context?: "product" | "service"; // for placeholder text
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function InlineReviewForm({ onSubmit, onCancel, context = "product" }: Props) {
  const [rating, setRating] = useState(0);
  const [title,  setTitle]  = useState("");
  const [body,   setBody]   = useState("");

  const canSubmit = rating > 0 && title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ rating, title: title.trim(), body: body.trim() });
    setRating(0); setTitle(""); setBody("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-surface-container-lowest backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-on-surface">Write a Review</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-on-surface-variant hover:text-on-surface bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-surface-container transition-colors"
          aria-label="Cancel"
        >
          <IconClose size={18} weight="regular" />
        </button>
      </div>

      {/* Star rating */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Your Rating</p>
        <StarPicker value={rating} onChange={setRating} />
        {rating === 0 && (
          <p className="text-[10px] text-on-surface-variant">Click a star to rate</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={context === "service" ? "Summarise your experience…" : "What's most important to know?"}
          maxLength={80}
          className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none"
        />
      </div>

      {/* Body */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Your Review
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            context === "service"
              ? "Tell others what you liked about this service…"
              : "Tell others what you liked or didn't like…"
          }
          rows={3}
          className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          Post Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-full text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer border-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
