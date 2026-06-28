"use client";

import { cn } from "@/lib/utils";
import StarRating from "./StarRating";
import { IconThumbUp, IconFlag } from "@/lib/icons";

export default function ReviewCard({ review, helpfulCount, isVoted, onHelpful }) {
  return (
    <article className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-card-sm hover:shadow-card-md transition-all duration-300 space-y-3">
      {/* Header row: avatar + name/stars + date */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
              review.avatarBg,
              review.avatarFg
            )}
          >
            {review.initials}
          </div>

          <div>
            <p className="text-xs font-bold text-on-surface">{review.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} size={14} />
              {review.verified && (
                <span className="text-[10px] font-bold uppercase tracking-tight bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-on-surface-variant flex-shrink-0">{review.date}</span>
      </div>

      {/* Review title */}
      <h5 className="text-xs font-bold text-on-surface">{review.title}</h5>

      {/* Review body */}
      <p className="text-xs text-on-surface-variant leading-relaxed">{review.body}</p>

      {/* Attached photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2">
          {review.photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Review photo ${i + 1}`}
              className="w-20 h-20 rounded-xl object-cover border border-outline-variant hover:scale-105 transition-transform cursor-pointer"
            />
          ))}
        </div>
      )}

      {/* Footer: helpful + report */}
      <div className="flex items-center gap-5 pt-3 border-t border-outline-variant/20">
        <button
          onClick={onHelpful}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors bg-transparent border-none cursor-pointer p-0",
            isVoted ? "text-primary" : "text-on-surface-variant hover:text-primary"
          )}
        >
          <IconThumbUp
            size={16}
            className="leading-none"
            weight={isVoted ? "fill" : "regular"}
            style={{ transition: "transform 0.15s", transform: isVoted ? "scale(1.2)" : "scale(1)" }}
          />
          Helpful ({helpfulCount})
        </button>

        <button className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-error transition-colors bg-transparent border-none cursor-pointer p-0">
          <IconFlag size={16} className="leading-none" weight="regular" />
          Report
        </button>
      </div>
    </article>
  );
}
