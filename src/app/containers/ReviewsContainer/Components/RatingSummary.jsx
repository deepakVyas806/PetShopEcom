"use client";

import { useState, useEffect } from "react";

function RatingBar({ star, pct, animated }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-on-surface-variant w-11 flex-shrink-0">{star} Star</span>
      <div className="flex-1 h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-container rounded-full"
          style={{
            width: animated ? `${pct}%` : "0%",
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <span className="text-xs text-on-surface-variant w-7 text-right flex-shrink-0">{pct}%</span>
    </div>
  );
}

export default function RatingSummary({ product, onWriteReview }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(id);
  }, []);

  if (!product) return null;
  const hasReviews = product.ratingDistribution && product.ratingDistribution.length > 0;

  return (
    <div className="p-4 rounded-xl space-y-4 bg-surface-container-lowest border border-outline-variant/20 shadow-card-sm">
      <h2 className="text-sm font-bold text-on-surface">Customer Reviews</h2>

      {hasReviews ? (
        <div className="space-y-2.5">
          {product.ratingDistribution.map(({ star, pct }) => (
            <RatingBar key={star} star={star} pct={pct} animated={animated} />
          ))}
        </div>
      ) : (
        <div className="py-3 text-center space-y-1">
          <p className="text-xs font-semibold text-on-surface">No reviews yet</p>
          <p className="text-xs text-on-surface-variant">Be the first to share your experience</p>
        </div>
      )}

      {/* Write a review */}
      <div className="border-t border-outline-variant/30 pt-4 space-y-2">
        <p className="text-xs font-semibold text-on-surface">Review this product</p>
        <p className="text-xs text-on-surface-variant">Share your thoughts with other pet owners</p>
        <button
          onClick={onWriteReview}
          className="w-full py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-brand-sm hover:shadow-brand-md hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}
